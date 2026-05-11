import { useContext } from "react";
import { CartContext } from "../Components/CartContext";

export const useCart = () => useContext(CartContext);
export default useCart;