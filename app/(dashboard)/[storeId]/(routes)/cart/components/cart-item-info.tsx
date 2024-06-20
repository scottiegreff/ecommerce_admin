interface CartItemInfoProps {
  service: Record<string, any>;
}

const CartItemInfo: React.FC<CartItemInfoProps> = ({
  service
}) => {
  return ( 
    <div>
      <div className="flex justify-between">
        <p className=" text-sm font-semibold text-black">
          {service.name}
        </p>
      </div>

      <div className="mt-1 flex text-sm">
        <p className="text-gray-500">{service.duration}</p>
        <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">{service.description}</p>
      </div>
      <p className="mt-1 text-sm font-medium text-gray-900">{service.price}</p>
    </div>
  );
}
 
export default CartItemInfo;
