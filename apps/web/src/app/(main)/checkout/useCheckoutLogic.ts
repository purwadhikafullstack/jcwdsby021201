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

export function useCheckoutLogic() {
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
  const [warehouseLatitude, setWarehouseLatitude] = React.useState(0);
  const [warehouseLongitude, setWarehouseLongitude] = React.useState(0);
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
          setWarehouseLatitude(warehousePick.latitude);
          setWarehouseLongitude(warehousePick.longitude);

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
      await checkAndMutateStock({
        warehouseId: warehouse,
        products: product,
        latitude: warehouseLatitude,
        longitude: warehouseLongitude,
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
        await createOrder({ token, orderData });
        router.push('/transfer');
      } else {
        setErrorMessage('User token is not available. Please log in again.');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setErrorMessage('Failed to create order. Please try again.');
    }
  };

  return {
    selectedAddressId,
    shippingCost,
    paymentMethod,
    courier,
    errorMessage,
    showAddressForm,
    product,
    dataAddress,
    setSelectedAddressId,
    setPaymentMethod,
    setCourier,
    setShowAddressForm,
    refreshAddresses,
    handleAddressChange,
    calculateTotal,
    handleCheckout,
  };
}
