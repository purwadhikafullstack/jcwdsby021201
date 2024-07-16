//Calculate Total
export const calculateTotal = (product: any[] | undefined) => {
  return product?.reduce((sum, item) => sum + item.quantity * item.price, 0);
};

//generate abstrak buat order name:
export function generateRandomAlphabet(length: number) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
