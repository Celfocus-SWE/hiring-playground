export interface ProductCardProps {
  image: string;
  title: string;
  description: string;
  price: string;
  onAddToCart: () => void;
  isOnline: boolean;
}
