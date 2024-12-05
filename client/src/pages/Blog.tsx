import BlogList from '../components/template/BlogList';
import FeaturedPost from '../components/template/FeaturedPost';
import Sidebar from '../components/template/Sidebar';

const Blog = () => {
  return (
    <div className='container mx-auto px-4 py-8'>
      <FeaturedPost />
      <div className='mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <BlogList />
        <Sidebar />
      </div>
    </div>
  );
};

export default Blog;
