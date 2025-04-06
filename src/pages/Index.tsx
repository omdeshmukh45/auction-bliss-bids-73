
import Layout from "@/components/layout/Layout";
import HeroBanner from "@/components/home/HeroBanner";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import FeaturedAuctions from "@/components/home/FeaturedAuctions";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/home/CallToAction";

const Index = () => {
  return (
    <Layout>
      <HeroBanner />
      <FeaturedCategories />
      <FeaturedAuctions />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
    </Layout>
  );
};

export default Index;
