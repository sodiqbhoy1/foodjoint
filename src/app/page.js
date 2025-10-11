import Homepage from "@/components/Homepage";
import { Metadata } from 'next';

export const metadata = {
  title: "FoodJoint - Delicious Food Delivered Fresh | Fast Food Delivery",
  description: "Order fresh, delicious meals delivered to your doorstep in 15-30 minutes. Premium ingredients, authentic flavors, and real-time tracking. Free delivery on orders above ₦5,000.",
  keywords: "food delivery, restaurant, fast delivery, Nigerian food, pizza, burger, online ordering",
  openGraph: {
    title: "FoodJoint - Delicious Food Delivered Fresh",
    description: "Experience the finest cuisine delivered straight to your doorstep. Fresh ingredients, authentic flavors, and lightning-fast delivery.",
    type: "website",
  },
};

export default function Home() {
  return <Homepage />;
}
