import Circle from "../logo/Circle";
import Shuriken from "../logo/Shuriken";
const Footer = () => {
  return (
    <>
      <div className="">
        <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
          <div className="">
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left gap-4 font-medium mx-auto">
              {/* Logo container */}
              <div className="flex items-center justify-center gap-2.5">
                <div className="relative w-12 h-12">
                  <Circle />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Shuriken className="w-1/2 h-1/2 object-contain" />
                  </div>
                </div>
                <h1>ShopIT</h1>
              </div>
              {/* Description */}
              <p className="w-full md:w-2/3 text-gray-600">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Temporibus, ducimus non? Recusandae voluptate error a modi
                asperiores laudantium reiciendis molestias quia aliquid? Dicta
                maiores soluta, optio architecto accusamus ipsa eaque.
              </p>
            </div>
          </div>
          <div>
            <p className="text-xl font-medium mb-5">Company</p>
            <ul className="flex flex-col gap-1 text-gray-600">
              <li>Home</li>
              <li>Contact</li>
              <li>About Us</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div>
            <p className="text-xl font-medium mb-5">Get In Touch</p>
            <ul className="flex flex-col gap-1 text-gray-600">
              <li>Number: +123456789</li>
              <li>Email:dev@dev.com</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
