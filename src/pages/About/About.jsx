import "./About.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Posts from "../../components/Posts";
import Marquee from "../../components/Marquee";

const imgBackground = "/products/aboutbg.png";
const imgAboutBg2 =
  "/products/bg2.png";
const imgAboutImg =
  "/products/girl.png";
const imgH5Img6 =
  "/products/proten.png";
const imgPlaySvg =
  "/supplements/play.png";
const imgPlayRing =
  "/images/border.png";
const imgIconPricing =
  "/products/pricing.png";
const imgIconQuality =
  "/products/quality.png";
const imgIconPerf =
  "/products/performance.png";
const imgIconCustomer =
  "/products/customers.png";


const featureCards = [
  {
    img: imgIconPricing,
    title: "Pricing",
    desc: "We work closely with our suppliers to be able to offer you the best deals on all the brands we stock.",
  },
  {
    img: imgIconQuality,
    title: "Quality",
    desc: "We buy bulk quantities of supplements and accessories and stock over 1000 products",
  },
  {
    img: imgIconPerf,
    title: "Performance",
    desc: "We cater for all styles and thousands of accessories to perfectly tailor to your fitness experience.",
  },
  {
    img: imgIconCustomer,
    title: "Customers",
    desc: "We provide all of our customers with fast and reliable service",
  },
];

export default function About() {
  return (
    <>
      <Header />
      <div className="about-page">
        <section className="about-hero">
          <img src={imgBackground} alt="" className="about-hero__bg" />
          <div className="about-hero__overlay" />
          <div className="about-hero__content">
            <h1 className="about-hero__title">About Us</h1>
            <p className="about-hero__sub">
              A supplement brand created for you and together with you.
            </p>
          </div>
        </section>

        <section className="about-athletes">
          <div className="about-athletes__wrap">
            <div className="about-ath-heading">
              <p className="about-ath-h1">supporting athletes</p>
              <p className="about-ath-h2">since 1983</p>
            </div>
            <div className="about-ath-body">

              <p className="about-ath-p2">
                My name is Davy Mize, and I am the owner and CEO of Bayou Muscle supplements and sportswear. Based in Monroe, LA, we draw upon our roots and heritage of our local culture and it reflects in our branding and products. This brand was born out of a passion for health and fitness that I discovered when I started my fitness journey on January 23, 2026, when I walked into the gym after a 25 year hiatus from working out. My passion was fueled by a desire to Be Better, in everything and all aspects of my life. I realized that I needed to be healthier, stronger, and more disciplined, in order to be present at all times and be the kind of Christian, Husband, Father, Employee, that I needed to be. After I began using different supplements and getting some really positive results from some of them, it sparked my interest to learn everything I could about the supplements and the ingredients that are in them. So I began relentlessly researching and studying all of the different products. And that led me to have concerns about the honesty and integrity of some of the products and brands out there. So I decided that if I am going to take supplements, then I want to make my own because then I will know exactly what is in them and how they are made. And that is what Bayou Muscle is based around, Honesty, Integrity, and Quality. Those are the key facets that drive us to be who we are, and what we seek to bring to you the consumer. Because we want our products to benefit you and help you achieve your goals, whatever they may be.
              </p>
              <p className="about-ath-p1">
                From my family to yours, thank you so much for your business and let us know what you think of our products and how we can be better so that we can help you.
              </p>
            </div>
            <div className="about-stats">
              <div className="about-stats__left">
                <p className="about-stats__num">
                  25<span>+</span>
                </p>
                <p className="about-stats__lbl">years of consumer trust</p>
              </div>
              <div className="about-stats__right">
                <p className="about-stats__num">
                  185<span>K+</span>
                </p>
                <p className="about-stats__lbl">bottles sold last year</p>
              </div>
            </div>
            <p className="about-mission">
              We are not your average retail nutrition company pushing
              <br />
              unnecessary products on people just to make a buck.
            </p>
          </div>
        </section>

        <section className="about-video">
          <div className="about-video__inner">
            <img src={imgAboutBg2} alt="" className="about-video__bg" />
            <div className="about-video__overlay" />
            <div className="about-video__center">
              <div className="about-video__ring-wrap">
                {/* <div className="about-video__ring-spin">
                  <img src={imgPlayRing} alt="" />
                </div> */}
                <button className="about-video__play" aria-label="Play video">
                  <img src={imgPlaySvg} alt="play" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="about-quality">
          <div className="about-quality__wrap">
            <div className="about-q-heading">
              <p className="about-q-h1">Commitment to</p>
              <p className="about-q-h2">quality</p>
            </div>
            <p className="about-quality__desc">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do
              amet sint. Velit officia consequat duis enim velit mollit.
              Exercitation veniam consequat sunt nostrud amet.
            </p>
            <div className="about-quality__layout">
              <div className="about-quality__athlete">
                <img src={imgAboutImg} alt="Athlete" />
              </div>
              <div className="about-quality__cards">
                {featureCards.map((c) => (
                  <div className="about-card" key={c.title}>
                    <div className="about-card__icon">
                      <img src={c.img} alt={c.title} />
                    </div>
                    <div className="about-card__body">
                      <h3 className="about-card__title">{c.title}</h3>
                      <p className="about-card__desc">{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="about-quality__bottle">
                <img src={imgH5Img6} alt="Supplement" />
              </div>
            </div>
          </div>
        </section>

        <Marquee />
        <Posts />
      </div>
      <Footer />
    </>
  );
}
