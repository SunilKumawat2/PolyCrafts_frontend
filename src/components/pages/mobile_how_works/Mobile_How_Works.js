import React, { useState } from 'react'
import WorksIcon1 from "../../../../src/assets/images/mobile-works1.svg";
import WorksIcon2 from "../../../../src/assets/images/mobile-works2.svg";
import WorksIcon3 from "../../../../src/assets/images/mobile-works3.svg";
import WorksImg1 from "../../../../src/assets/images/works-img1.png";
import WorksImg2 from "../../../../src/assets/images/works-img2.png";
import WorksImg3 from "../../../../src/assets/images/mobile-works-video.mp4";
import Book_Call from '../../common/book_call_popup/Book_Call';


const Mobile_How_Works = () => {

    const [Bookshow, setBookShow] = useState(false);

    const handleBookShow = () => setBookShow(true);
    const handleBookClose = () => setBookShow(false);


    return (
        <>
            <section className='mobile-how-works-sec px-85'>
                <div className="container-fluid">
                    <div className='headings'>
                        <h2>How it works</h2>
                        <h3>Power of Pro Artist + AI</h3>
                        <p>We blend custom 3D animation into the choice of your template & create a smart product video to help your brands of any size stand out in the crowded market place.</p>
                    </div>
                    <div className='works-step one'>
                        <div className='head-box'>
                            <img src={WorksIcon1} alt="WorksIcon1" />
                            <div className='content-box'>
                                <h4>Upload Product Image</h4>
                                <img src={WorksImg1} alt="WorksImg1" />
                            </div>
                        </div>
                    </div>
                    <div className='works-step two'>
                        <div className='head-box'>
                            <img src={WorksIcon2} alt="WorksIcon2" />
                            <div className='content-box'>
                                <h4>Reference Images</h4>
                                <img src={WorksImg2} alt="WorksImg2" />
                            </div>
                        </div>
                    </div>
                    <div className='works-step three'>
                        <div className='head-box'>
                            <img src={WorksIcon3} alt="WorksIcon3" />
                            <div className='content-box'>
                                <h4>Final Video</h4>
                                <video loop muted autoPlay playsInline
                                    webkit-playsinline="true"
                                    preload="auto">
                                    <source src={WorksImg3} />
                                </video>
                            </div>
                        </div>
                    </div>

                    {/* <div className='col-book-btn'>
                        <button className='btn btn-primary' onClick={handleBookShow}>
                            Book A Call
                        </button>
                        <Book_Call Bookshow={Bookshow} handleBookClose={handleBookClose} />
                    </div> */}

                </div>
            </section>
        </>
    )
}

export default Mobile_How_Works