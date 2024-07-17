'use client';
import CheckoutTable from '@/components/table/CheckoutTable';
import AddressAndPaymentSelection from '@/views/checkout/AddressAndPaymentSelection';
import CourierSelection from '@/views/checkout/CourierSelection';
import OrderSummary from '@/views/checkout/OrderSummary';
import {
  Container,
  Grid,
  Typography,
  Alert,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import * as React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SelectChangeEvent } from '@mui/material';
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
  calculateTotal,
  formatOrderDate,
  generateRandomAlphabet,
} from './CheckoutHelper';

interface ICheckoutProps {}

const Checkout: React.FunctionComponent<ICheckoutProps> = (props) => {
  //Session
  const router = useRouter();
  const session = useSession();
  const user = session.data?.user as UserSession;
  const token = user?.token;

  //State
  const [selectedAddressId, setSelectedAddressId] = React.useState<number>(0);
  const [shippingCost, setShippingCost] = React.useState<number>(0);
  const [paymentMethod, setPaymentMethod] = React.useState('mandiri');
  const [courier, setCourier] = React.useState('jne');
  const [warehouse, setWarehouse] = React.useState('');
  const [warehouseCity, setWarehouseCity] = React.useState('');
  const [warehouseLatitude, setWarehouseLatitude] = React.useState(0);
  const [warehouseLongitude, setWarehouseLongitude] = React.useState(0);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isLoadingAll, setIsLoadingAll] = React.useState(false);
  const [showAddressForm, setShowAddressForm] = React.useState(false);

  //Queries
  const { data: product } = useGetProductCart(token || '');
  const { data: dataAddress, refetch: refetchAddresses } = useGetAddressById(
    token || '',
  );

  //Refetch
  const refreshAddresses = () => {
    refetchAddresses();
    setShowAddressForm(false);
    setErrorMessage(null);
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
      console.error('Error calculating shipping cost:', error);
      setShippingCost(0);
    }
  };

  // handler untuk memperbarui gudang dan biaya pengiriman
  const updateWarehouseAndShipping = async (address: any) => {
    try {
      const warehousePick = await fetchWarehouseNearest({
        latitude: address.latitude,
        longitude: address.longitude,
      });
      setWarehouse(warehousePick.warehouseId);
      setWarehouseCity(String(warehousePick.city.id));
      setWarehouseLatitude(warehousePick.latitude);
      setWarehouseLongitude(warehousePick.longitude);

      await calculateShippingCost(
        String(address.cityId),
        String(warehousePick.city.id),
      );
    } catch (error) {
      console.error('Error updating warehouse and shipping:', error);
      setErrorMessage(
        'Failed to update shipping information. Please try again.',
      );
    }
  };

  //inisiasi awal
  React.useEffect(() => {
    const initializeCheckout = async () => {
      if (dataAddress && dataAddress.length === 0) {
        setErrorMessage(
          'You don`t have any addresses yet. Please add an address in select to continue.',
        );
      } else if (
        dataAddress &&
        dataAddress.length > 0 &&
        selectedAddressId === 0
      ) {
        const primaryAddr =
          dataAddress.find((addr: any) => addr.isPrimary) || dataAddress[0];
        if (primaryAddr && primaryAddr.id !== undefined) {
          setSelectedAddressId(primaryAddr.id);
          await updateWarehouseAndShipping(primaryAddr);
        }
      }
    };

    initializeCheckout();
  }, [dataAddress, selectedAddressId]);

  //menghitung ulang biaya pengiriman ketika courier atau alamat berubah
  React.useEffect(() => {
    const updateShippingCost = async () => {
      if (selectedAddressId && warehouseCity) {
        setIsLoadingAll(true);
        const selectedAddress = dataAddress?.find(
          (addr: any) => addr.id === selectedAddressId,
        );
        if (selectedAddress) {
          await calculateShippingCost(
            String(selectedAddress.cityId),
            warehouseCity,
          );
        }
        setIsLoadingAll(false);
      }
    };
    updateShippingCost();
  }, [courier, selectedAddressId, warehouseCity, dataAddress]);

  //INI PERUBAHAN ADDRESS :
  const handleAddressChange = async (
    event: SelectChangeEvent<number | string>,
  ) => {
    setIsLoadingAll(true);
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

      const selectedAddress = dataAddress?.find(
        (addr: any) => addr.id === newAddressId,
      );

      if (selectedAddress) {
        await updateWarehouseAndShipping(selectedAddress);
      }
    }
    setIsLoadingAll(false);
  };

  //checkout
  const handleCheckout = async () => {
    try {
      if (!selectedAddressId) {
        setErrorMessage('Please select an address before checkout.');
        return;
      }
      if (!product || product.length === 0) {
        setErrorMessage('Your cart is empty');
        return;
      }

      const selectedAddress = dataAddress?.find(
        (addr: any) => addr.id === selectedAddressId,
      );
      //Check gudang apakah di gudang terdekat ada? kalo gaada lakukan
      await checkAndMutateStock({
        warehouseId: warehouse,
        products: product,
        latitude: warehouseLatitude,
        longitude: warehouseLongitude,
      });

      const total = (calculateTotal(product) || 0) + shippingCost;
      //buat tanggal di order :
      const order = new Date().toISOString();
      const formattedDate = formatOrderDate(new Date(order));

      const orderData = {
        name: 'ORDER-' + formattedDate + '-' + generateRandomAlphabet(7),
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
        await createOrder({ token, orderData });
        router.push('/dashboard/user/order/to-pay');
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
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoadingAll}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}
      <Typography
        variant="h5"
        gutterBottom
        sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}
      >
        Checkout
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <CheckoutTable product={product} />
          <AddressAndPaymentSelection
            selectedAddressId={selectedAddressId}
            paymentMethod={paymentMethod}
            dataAddress={dataAddress}
            handleAddressChange={handleAddressChange}
            setPaymentMethod={setPaymentMethod}
            setShowAddressForm={setShowAddressForm}
            refreshAddresses={refreshAddresses}
            showAddressForm={showAddressForm}
          />
          <CourierSelection courier={courier} setCourier={setCourier} />
        </Grid>
        <Grid item xs={12} md={4} sx={{ backgroundColor: 'eee' }}>
          <OrderSummary
            subtotal={calculateTotal(product) || 0}
            shippingCost={shippingCost}
            onCheckout={handleCheckout}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout;
