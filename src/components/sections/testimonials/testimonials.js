import React from 'react';
import './testimonials.css';
import Slider from 'react-slick';
import { animated, useSpring } from 'react-spring';

function Testimonials() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  const [sliderProps, setSliderProps] = useSpring(() => ({
    transform: 'scale(1)',
    config: { tension: 200, friction: 20 },
  }));

  const handleSliderEnter = () => {
    setSliderProps({ transform: 'scale(1.1)' });
  };

  const handleSliderLeave = () => {
    setSliderProps({ transform: 'scale(1)' });
  };

  const [slideProps, setSlideProps] = useSpring(() => ({
    transform: 'translateY(0px)',
    config: { tension: 200, friction: 20 },
  }));

  const handleSlideEnter = () => {
    setSlideProps({ transform: 'translateY(-10px)' });
  };

  const handleSlideLeave = () => {
    setSlideProps({ transform: 'translateY(0px)' });
  };

  return (
    <section id="testimonials" className="testimonials">
      <div className="testimonials__content">
        <h2 className="testimonials__title">Testimonials</h2>
        <animated.div
          className="testimonials__slider"
          style={sliderProps}
          onMouseEnter={handleSliderEnter}
          onMouseLeave={handleSliderLeave}
        >
          <Slider {...settings}>
            <div className="testimonials__slide">
              <animated.p
                className="testimonials__quote"
                style={slideProps}
                onMouseEnter={handleSlideEnter}
                onMouseLeave={handleSlideLeave}
              >
                "I had the pleasure of working with Aaron on my new website, and I couldn't be happier with the results.
                Aaron listened carefully to my needs and goals for the site, and created a beautiful and functional design
                 that exceeded my expectations. The site is easy to navigate and has a clean and modern look that perfectly
                 reflects my brand. Not only that, but Aaron was a pleasure to work with, always responsive and professional 
                 throughout the process. I highly recommend Aaron to anyone looking for a talented and creative web designer!"
              </animated.p>
              <animated.p
                className="testimonials__author"
                style={slideProps}
                onMouseEnter={handleSlideEnter}
                onMouseLeave={handleSlideLeave}
              >
                - Susan 
              </animated.p>
            </div>
            <div className="testimonials__slide">
              <animated.p
                className="testimonials__quote"
                style={slideProps}
                onMouseEnter={handleSlideEnter}
                onMouseLeave={handleSlideLeave}
              >
                "I recently had the pleasure of working with Aaron to create a new website for my business, 
                and I couldn't be happier with the results. From the very beginning, Aaron took the time to understand my needs and goals, 
                and he worked tirelessly to bring my vision to life. The website he created is not only beautiful and user-friendly,
                 but it also accurately represents my brand and helps me connect with my customers in a meaningful way. 
                 I have received so many compliments on the website since it launched, and I am grateful to Aaron for his professionalism, creativity, and commitment to excellence."
              </animated.p>
              <animated.p
                className="testimonials__author"
                style={slideProps}
                onMouseEnter={handleSlideEnter}
                onMouseLeave={handleSlideLeave}
              >
                - phillis 
              </animated.p>
            </div>
          </Slider>
        </animated.div>
      </div>
    </section>
  );
}

export default Testimonials;
