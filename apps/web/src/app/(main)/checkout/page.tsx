'use client';
import AddidasButton from '@/components/button/StyledButton';
import AddressForm from '@/components/form/AddAddressForm';
import CheckoutTable from '@/components/table/CheckoutTable';
import { UserSession } from '@/features/types';
import { useGetAddressById } from '@/features/user/address/addressQueries';
import { useGetProductCart } from '@/features/user/cart/cartQueries';
import {
  checkAndMutateStock,
  createOrder,
  fetchShippingCost,
  fetchWarehouseNearest,
} from '@/features/user/order/orderFetcher';
import {
  Button,
  Container,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Select,
  Typography,
  SelectChangeEvent,
  Alert,
  Box,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import * as React from 'react';

interface ICheckoutProps {}

const Checkout: React.FunctionComponent<ICheckoutProps> = (props) => {
  const router = useRouter();
  const session = useSession();
  const user = session.data?.user as UserSession;
  const token = user?.token;

  const [selectedAddressId, setSelectedAddressId] = React.useState<number>(0);
  const [shippingCost, setShippingCost] = React.useState<number>(0);
  const [paymentMethod, setPaymentMethod] = React.useState('mandiri');
  const [courier, setCourier] = React.useState('jne');
  const [warehouse, setWarehouse] = React.useState('');
  const [warehouseCity, setWarehouseCity] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  //New Address In Checkout Page
  const [showAddressForm, setShowAddressForm] = React.useState(false);

  const { data: product, error, isLoading } = useGetProductCart(token || '');
  const { data: dataAddress, refetch: refetchAddresses } = useGetAddressById(
    token || '',
  );

  //Refetch
  const refreshAddresses = () => {
    refetchAddresses();
    setShowAddressForm(false);
  };

  //Shipping cost
  const calculateShippingCost = async (cityId: string, origin: string) => {
    try {
      const shippingCost = await fetchShippingCost({
        courier: courier,
        destination: cityId,
        origin: origin,
        weight: 1000,
      });

      setShippingCost(shippingCost);
    } catch (error) {
      setShippingCost(0);
    }
  };

  React.useEffect(() => {
    if (selectedAddressId && warehouseCity) {
      const selectedAddress = dataAddress?.find(
        (addr: any) => addr.id === selectedAddressId,
      );
      if (selectedAddress) {
        calculateShippingCost(String(selectedAddress.cityId), warehouseCity);
      }
    }
  }, [selectedAddressId, warehouseCity, courier]);

  //FETCH AWAL UNTUK ADDRESS YANG DIPILIH
  React.useEffect(() => {
    const initializeCheckout = async () => {
      if (dataAddress && dataAddress.length === 0) {
        setErrorMessage(
          'You don`t have any addresses yet. Please add an address to continue.',
        );
      } else if (dataAddress && dataAddress.length > 0) {
        //manggil data keseluruhan dari addressId
        const primaryAddr =
          dataAddress.find((addr: any) => addr.isPrimary) || dataAddress[0];
        if (primaryAddr && primaryAddr.id !== undefined) {
          setSelectedAddressId(primaryAddr.id);
        }

        try {
          // Dapatkan warehouse terdekat terlebih dahulu
          const warehousePick = await fetchWarehouseNearest({
            latitude: primaryAddr.latitude,
            longitude: primaryAddr.longitude,
          });
          setWarehouse(warehousePick.warehouseId);
          setWarehouseCity(String(warehousePick.city.id));

          // warehouse :
          await calculateShippingCost(
            String(primaryAddr.cityId),
            String(warehousePick.city.id),
          );
        } catch (error) {
          console.error('Error checkout:', error);
          setErrorMessage('Failed checkout. Please try again.');
        }

        setErrorMessage(null);
      }
    };

    initializeCheckout();
  }, [dataAddress, courier]);

  //INI PERUBAHAN ADDRESS :
  const handleAddressChange = async (
    event: SelectChangeEvent<number | string>,
  ) => {
    //handle addAddress
    const newAddress = event.target.value as string;
    if (newAddress === 'add_address') {
      setShowAddressForm(true);
      setShippingCost(0);
      setSelectedAddressId('add_address' as any);
    } else {
      //hadnle addressChange asli :
      const newAddressId = event.target.value as number;
      setSelectedAddressId(newAddressId);
      // ini buat mendapatkan data address lengkapnya
      const selectedAddress = dataAddress?.find(
        (addr: any) => addr.id === newAddressId,
      );
      if (selectedAddress) {
        const warehousePick = await fetchWarehouseNearest({
          latitude: selectedAddress.latitude,
          longitude: selectedAddress.longitude,
        });

        setWarehouse(warehousePick.warehouseId);
        setWarehouseCity(warehousePick.city.id);
        await calculateShippingCost(
          String(selectedAddress.cityId),
          String(warehousePick.city.id),
        );
      }
    }
  };

  //Calculate Total
  const calculateTotal = () => {
    return product?.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  //generate abstrak buat order name:
  function generateRandomAlphabet(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  }

  const handleCheckout = async () => {
    try {
      if (!selectedAddressId) {
        setErrorMessage('Please select an address before checkout.');
        return;
      }
      if (!product || product.length === 0) {
        setErrorMessage(
          'Your cart is empty. Please add products before checkout.',
        );
        return;
      }

      const selectedAddress = dataAddress?.find(
        (addr: any) => addr.id === selectedAddressId,
      );

      //Check gudang apakah di gudang terdekat ada? kalo gaada lakukan
      const checkStock = await checkAndMutateStock({
        warehouseId: warehouse,
        products: product,
      });

      const total = (calculateTotal() || 0) + shippingCost;

      //buat tanggal di order :
      const order = new Date().toISOString();
      const formattedDate = new Date(order)
        .toLocaleDateString('en-GB')
        .split('/')
        .reverse()
        .join('-');

      const orderData = {
        name: 'Order-' + formattedDate + '-' + generateRandomAlphabet(7),
        paymentStatus: 'UNPAID',
        shippingCost: shippingCost,
        total: total,
        paymentMethod: paymentMethod,
        warehouseId: warehouse,
        cartId: product[0].cartId,
        addressId: selectedAddressId,
        courier: courier,
        latitude: Number(selectedAddress?.latitude),
        longitude: Number(selectedAddress?.longitude),
        orderProducts: product.map((item) => ({
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price,
          productId: item.productId,
        })),
      };

      if (token) {
        const response = await createOrder({ token, orderData });
        router.push('/transfer');
      } else {
        setErrorMessage('User token is not available. Please log in again.');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setErrorMessage('Failed to create order. Please try again.');
    }
  };

  return (
    <Container sx={{ my: '120px' }}>
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}
      <Typography variant="h4" gutterBottom sx={{ textTransform: 'uppercase' }}>
        Checkout
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <CheckoutTable product={product} />

          {/* SEDERHANAKAN INI MENJADI COMPONENT ADDRESS DENGAN PROPS */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Typography>Select Address:</Typography>
              <Select
                value={selectedAddressId}
                onChange={handleAddressChange}
                fullWidth
              >
                {dataAddress?.map((address: any) => (
                  <MenuItem key={address.id} value={address.id}>
                    {address.address}
                  </MenuItem>
                ))}
                <MenuItem value={'add_address'}>Add New Address</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12}>
              <Typography>Select Payment Method:</Typography>
              <Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                fullWidth
              >
                <MenuItem value="mandiri">Bank Mandiri</MenuItem>
                <MenuItem value="bca">Bank BCA</MenuItem>
                <MenuItem value="bri">Bank BRI</MenuItem>
                <MenuItem value="bni">Bank BNI</MenuItem>
                <MenuItem value="gopay">Go-Pay</MenuItem>
                <MenuItem value="ovo">OVO</MenuItem>
              </Select>
            </Grid>
          </Grid>
          {/* SEDERHANAKAN INI MENJADI COMPONENT ADDRESS DENGAN PROPS */}

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Typography>Select Courier :</Typography>
              <Select
                value={courier}
                onChange={(event: SelectChangeEvent<string>) =>
                  setCourier(event.target.value)
                }
                fullWidth
              >
                <MenuItem value="jne">Jalur Nugraha Ekakurir (JNE)</MenuItem>
                <MenuItem value="pos">Pos Indonesia</MenuItem>
                <MenuItem value="tiki">TIKI</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={4} sx={{ backgroundColor: 'eee' }}>
          <Paper style={{ padding: 16 }}>
            <Typography variant="h6" sx={{ textTransform: 'uppercase' }}>
              Order Summary
            </Typography>
            <Typography variant="body1">
              Subtotal: Rp {calculateTotal()?.toLocaleString()}
            </Typography>
            <Typography variant="body1">
              Shipping Cost: Rp {shippingCost.toLocaleString()}
            </Typography>
            <Divider />
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Total : Rp {(calculateTotal()! + shippingCost).toLocaleString()}
            </Typography>
            <AddidasButton
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: 16 }}
              onClick={handleCheckout}
            >
              Make Order
            </AddidasButton>
          </Paper>
          {showAddressForm && (
            <Grid item xs={12}>
              <AddressForm
                shouldRedirect={false}
                onAddressAdded={refreshAddresses}
              />
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout;
