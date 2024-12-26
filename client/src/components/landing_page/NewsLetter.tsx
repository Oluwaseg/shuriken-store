const NewsLetter = () => {
  return (
    <>
      <div className="text-center">
        <p className="text-2xl font-medium text-gray-800 dark:text-white">
          Subscribe now & get 20% off
        </p>
        <p className="text-gray-400 mt-3 dark:text-white">
          Subscribe to our newsletter
        </p>
        <form
          action=""
          method="post"
          onClick={(e) => e.preventDefault()}
          className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border dark:bg-gray-900 pl-3"
        >
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            className="custom-input"
          />
          <button
            type="submit"
            className="bg-black text-white dark:bg-white dark:text-black text-sm px-10 py-4"
          >
            Subscribe
          </button>
        </form>
      </div>
    </>
  );
};

export default NewsLetter;
