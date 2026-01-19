import React, { useEffect, useState } from 'react';
import './VideoGalleryPage.css';
import { Loading } from '../../Utilities/Notification';

function VideoGalleryPage() {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <div className="VideoGalleryPage">

            {loading && <Loading loading={loading} />}

            <div className="heading">Videos</div>

            <div className="box">
                <div className="video">
                    <iframe width="300" height="250" src="https://www.youtube.com/embed/hzQOCsaQvK0" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>

                    <div className="p">Vinita Srivastava, National Senior consultant & co-ordinator Blood cell NHM Delhi</div>
                </div>

                <div className="video">
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/8Bi3WBm-vRI" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>

                    <div className="p">Dr Manpreet Chhatwal.Additional Project Director Punjab State AIDS Control Society cum State Nodal Officer State Blood Cell NHM Punjab</div>
                </div>

                <div className="video">
                    <iframe width="330" height="264" src="https://www.youtube.com/embed/6IUjcLZnbss" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>

                    <div className="p">Mr Manish Choudhary, State coordinator officer blood cell NHM Rajasthan</div>
                </div>

                <div className="video">
                    <iframe width="330" height="264" src="https://www.youtube.com/embed/crVglHe4tHA" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>

                    <div className="p">Dr Mahendra Kendre, ADHS blood cell DHS Mumbai</div>
                </div>

                <div className="video">
                    <iframe width="330" height="264" src="https://www.youtube.com/embed/X97vd6BnELs" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>

                    <div className="p">Dr. J.S. Arora, General Secretary at National Thalassemia Welfare Society & Federation of Indian Thalassemia, New Delhi</div>
                </div>

                <div className="video">
                    <iframe width="330" height="264" src="https://www.youtube.com/embed/IVGqDtRGB9o" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>

                    <div className="p">Dr Rakesh Munshi, Additional Director, Blood cell Madhya Pradesh</div>
                </div>

                <div className="video">
                    <iframe width="330" height="264" src="https://www.youtube.com/embed/ciJMbfT0xlg" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>

                    <div className="p">Message By : Dr Ruby Khan, Deputy Director, Blood Cell NHM, Madhya Pradesh</div>
                </div>

                <div className="h3">Message from Kids</div>

                <div className="video">
                    <iframe width="330" height="264" src="https://www.youtube.com/embed/_IRqKTgJdDs" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>

                    <div className="p">Kids Message: Let's Do it. Donate Blood for Thalassemia patient</div>
                </div>

                <div className="video">
                    <iframe width="330" height="264" src="https://www.youtube.com/embed/bTiws2YloYI" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>

                    <div className="p">Kids Life saving Message : Let's do it. Donate Blood</div>
                </div>

                <div className="h3">Message from Users</div>

                <div className="video">
                    <iframe width="330" height="264" src="https://www.youtube.com/embed/qKesV5s0rcw" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>

                    <div className="p">User's Feedback</div>
                </div>

                <div className="video">
                    <iframe width="330" height="264" src="https://www.youtube.com/embed/W97uuaZ9C5o" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>

                    <div className="p">User's Feedback</div>
                </div>

                <div className="video">
                    <iframe width="330" height="264" src="https://www.youtube.com/embed/zVMz6xPXT-4" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>

                    <div className="p">User's Feedback</div>
                </div>

                <div className="video" style={{ "paddingBottom": 0, border: "none" }}>
                    <iframe width="330" height="264" src="https://www.youtube.com/embed/wvF32eT5S88" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>

                    <div className="p">User's Feedback</div>
                </div>
            </div>

        </div>
    );

};

export default VideoGalleryPage;
