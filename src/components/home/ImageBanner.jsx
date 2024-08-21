import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const ImageBanner = () => {
  return (
    <div className="rounded-lg text-white pt-8 hover:cursor-pointer">
      <Carousel showThumbs={false} autoPlay={true} transitionTime={3000}>
        <div>
          <img src="/images/banner1.png" />
        </div>
        <div>
          <img src="/images/banner2.png" />
        </div>
        <div>
          <img src="/images/banner3.png" />
        </div>
      </Carousel>
    </div>
  );
};

export default ImageBanner;
