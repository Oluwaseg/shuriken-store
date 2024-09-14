import { RiExchangeFundsFill, RiVerifiedBadgeFill } from "react-icons/ri";
import { MdOutlineSupportAgent } from "react-icons/md";
const OurPolicy = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs md:text-base text-gray-700 dark:text-white">
      <div className="">
        <RiExchangeFundsFill size={45} className="m-auto mb-5" />
        <p className="font-semibold">Easy Exchange Policy</p>
        <p className="text-gray-400 dark:text-white">
          We offer hassle free exchange policy
        </p>
      </div>
      <div className="">
        <RiVerifiedBadgeFill size={45} className="m-auto mb-5" />
        <p className="font-semibold">7 Days Return Policy</p>
        <p className="text-gray-400 dark:text-white">
          We provide 7 days free return policy
        </p>
      </div>
      <div className="">
        <MdOutlineSupportAgent size={45} className="m-auto mb-5" />
        <p className="font-semibold">24/7 Customer Support</p>
        <p className="text-gray-400 dark:text-white">
          We provide 24/7 customer support
        </p>
      </div>
    </div>
  );
};

export default OurPolicy;
