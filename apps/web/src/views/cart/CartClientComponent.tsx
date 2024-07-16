'use client';
import React from 'react';
import {
  Container,
  Grid,
  Typography,
  Alert,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import TableCart from '@/components/table/CartListTable';
import OrderSummaryCart from './OrderSummaryCart';
import { useSession } from 'next-auth/react';
import { UserSession } from '@/features/types';
import {
  useDeleteProduct,
  useUpdateQuantity,
} from '@/features/user/cart/cartMutation';
import { useGetProductCart } from '@/features/user/cart/cartQueries';
import { useRouter } from 'next/navigation';
import { ProductBody } from '@/features/user/cart/type';
import { checkStock } from '@/features/user/cart/cartFecther';
import { errorFetcherNotification } from '@/utils/notifications';
import { isStockInsufficient } from './CartHelper';
interface ICartClientComponentProps {}

const CartClientComponent: React.FunctionComponent<
  ICartClientComponentProps
> = (props) => {
  const router = useRouter();
  const session = useSession();
  const user = session.data?.user as UserSession;
  const token = user?.token;

  //state object sebagai patokan productId dan stocknya
  const [productStocks, setProductStocks] = React.useState<{
    [key: number]: number;
  }>({});
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const { mutateAsync, isPending: isLoadingDelete } = useDeleteProduct();
  const { mutateAsync: updateQuantityProduct } = useUpdateQuantity();
  const { data: product, isLoading: isLoadingCart } = useGetProductCart(
    token || '',
  );

  //Handle Delete
  const deleteProduct = async (productId: number) => {
    try {
      if (token) {
        await mutateAsync({
          token,
          productId: productId,
        });
      }
    } catch (error) {
      errorFetcherNotification(error);
    }
  };

  const updateProductQuantity = async (
    token: string,
    productId: number,
    newQuantity: number,
  ) => {
    await updateQuantityProduct({
      token,
      data: {
        productId: Number(productId),
        quantity: newQuantity,
      },
    });
  };

  //Handle Update
  const updateQuantity = async (productId: number, newQuantity: number) => {
    setIsUpdating(true);
    setTimeout(async () => {
      try {
        if (token) {
          await updateProductQuantity(token, productId, newQuantity);
        }
      } catch (error) {
        errorFetcherNotification(error);
      } finally {
        setIsUpdating(false);
      }
    }, 2000);
  };

  //jumlah stock di seluruh gudang
  React.useEffect(() => {
    if (product) {
      product.forEach(async (item: ProductBody) => {
        const stock = await checkStock(item.productId);
        setProductStocks((prev) => {
          const newState = { ...prev, [item.productId]: stock };
          return newState;
        });
      });
    }
  }, [product]);

  const getMaxQuantity = (item: any) => {
    const stockQuantity = productStocks[item.productId] || 0;
    return stockQuantity;
  };

  //CheckSTock before checkout:
  const checkStockBeforeCheckout = async () => {
    if (!product || product.length === 0) {
      setErrorMessage('Your cart is empty');
      return false;
    }

    const { insufficientStock, errorMsg } = isStockInsufficient(
      product,
      productStocks,
    );

    if (insufficientStock) {
      setErrorMessage(errorMsg.slice(0, -2));
      //buatin supaya dia ga lanjut
      return false;
    }

    setErrorMessage(null);
    return true;
  };

  const calculateTotal = (): number | undefined => {
    return product?.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const handleCheckout = async () => {
    const stockOk = await checkStockBeforeCheckout();
    if (stockOk) {
      router.push('/checkout');
    }
  };

  const isLoading = isLoadingCart || isLoadingDelete || isUpdating;

  return (
    <Container sx={{ my: '120px' }}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}
      >
        Shopping Cart
      </Typography>
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <TableCart
            product={product}
            updateQuantity={updateQuantity}
            deleteProduct={deleteProduct}
            getMaxQuantity={getMaxQuantity}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <OrderSummaryCart
            calculateTotal={calculateTotal}
            handleCheckout={handleCheckout}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartClientComponent;
