import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchProductById } from "../../features/product/productSlice";

const Product = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { product, loading, error } = useAppSelector((state) => state.product);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (product && product.images.length > 0) {
      setMainImage(product.images[0].url);
    }
  }, [product]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div>
        <img
          src={mainImage || "/placeholder-image.jpg"}
          alt={product?.name}
          style={{ width: "100%", height: "auto" }}
        />
        <div>
          {product?.images.map((img, index) => (
            <img
              key={index}
              src={img.url}
              alt={`Thumbnail ${index + 1}`}
              style={{ width: "50px", height: "50px", cursor: "pointer" }}
              onClick={() => setMainImage(img.url)}
            />
          ))}
        </div>
      </div>

      <h2>{product?.name}</h2>
      <p>{product?.description}</p>
      <p>Price: ${product?.price}</p>
      <p>Stock: {product?.stock}</p>

      <div>
        {product?.ratings ? (
          <div>
            {Array.from({ length: 5 }, (_, index) => (
              <span key={index}>{index < product.ratings ? "★" : "☆"}</span>
            ))}
            <span> {product.ratings}/5</span>
          </div>
        ) : (
          <p>No Rating</p>
        )}
      </div>

      <div>
        <button>Add to Cart</button>
      </div>

      <div>
        <h3>About the Item</h3>
        <p>
          This is a detailed description of the product. You can include
          information about the material, usage, and any other relevant details.
        </p>
      </div>

      <div>
        <h3>Reviews</h3>
        <ul>
          {product?.reviews.length ? (
            product.reviews.map((review, index) => (
              <li key={index}>
                <p>{review.comment}</p>
                <p>Rating: {review.rating}/5</p>
              </li>
            ))
          ) : (
            <p>No Reviews Yet</p>
          )}
        </ul>
        <button>Read All Reviews</button>
      </div>
    </div>
  );
};

export default Product;
