import React, { useEffect, useRef, useState } from 'react';
import h337 from "heatmap.js";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { BiRotateRight, BiRotateLeft, BiMinus } from 'react-icons/bi';
import { BsPlusLg } from 'react-icons/bs';
import { TbFlipHorizontal } from 'react-icons/tb';
import mapImage from "../assets/images/bg_rotated.png";
import { useInterval } from 'usehooks-ts';


let heatmap;
let pointData = [{ x: 0, y: 0, value: 0 }];
function addHeatMap(ctn) {
    let config = {
        container: ctn,
        radius: 50,
    }
    heatmap = h337.create(config);

    heatmap.setData({
        max: 5,
        data: pointData
    });
}
// width, height of canvas is stored when image is loaded
let iw, ih;

function Heatmap(props) {
    let { fetchLiveData } = props;
    const heatmapData = useRef({
        history: [],
        live: []
    });
    // get the width and height of window to make heatmap responsive
    const width = window.innerWidth;
    const height = window.innerHeight;

    const mount = useRef(null);
    const [imgSrc, setImgSrc] = useState("");
    let centerViewFunction = undefined;

    useEffect(() => {
        mount.current.style.rotate = "0deg";
        if (mount.current.children[1])
            mount.current.children[1].remove();
        setImgSrc(mapImage);
    }, []);

    function imageLoaded(e) {
        if (mount.current.children[1])
            mount.current.children[1].remove();
        const imgWidth = e.target.naturalWidth;
        const imgHeight = e.target.naturalHeight;
        const parentWidth = mount.current.parentNode.parentNode.clientWidth;
        const parentHeight = mount.current.parentNode.parentNode.clientHeight;
        e.target.style.width = imgWidth + "px";
        mount.current.style.width = imgWidth + "px";
        iw = imgWidth;
        e.target.style.height = imgHeight + "px";
        mount.current.style.height = imgHeight + "px";
        ih = imgHeight;
        addHeatMap(mount.current);
        let scaleX = imgWidth / parentWidth;
        scaleX = 1 / scaleX;
        let scaleY = imgHeight / parentHeight;
        scaleY = 1 / scaleY;
        centerViewFunction(Math.min(scaleX, scaleY));
        heatmap.addData([{ x: 2000, y: 2000, value: 5 }]);
    }

    function rotate(deg) {
        let initRotateX = parseFloat(mount.current.style.rotate);
        initRotateX += deg;
        mount.current.style.rotate = initRotateX + "deg";
    }

    // function to add sample data on the heatmap
    const handleAddData = (data) => {
        // let h1 = 100; //h = y-axis
        // let w1 = 100; //w = x-axis

        // let data = {
        // x: Math.random() * w, // x coordinate of the datapoint, a number
        // y: Math.random() * h, // y coordinate of the datapoint, a number
        // value: Math.random() * 100 // the value at datapoint(x, y)
        // x: w,
        // y: h,
        // value: 100
        // };
        heatmap.addData(data);
    }

    const datapoints = useRef([{
        x: 0,
        y: 0,
        value: 0,
    }])

    useInterval(async () => {
        let dataResponse = await fetchLiveData();
        console.log("data Response: ", dataResponse);
        heatmapData.current = {
            ...heatmapData.current,
            live: dataResponse,
        }
        tempHandle(heatmapData.current.live, heatmapData.current.history);
    }, 1000);

    const tempHandle = (liveData, history) => {
        let hper = 75, wper = width <= 1279 ? 90 : 80;

        let h = hper * height / 100;
        let w = wper * width / 100;

        let prevData = [];
        if (liveData[0]) {
            let val = JSON.parse(liveData[0].value);
            for (let item in val) {
                let d = { x: (val[item].x / 100 * iw), y: (val[item].y / 100 * ih), value: 50 };
                prevData.push(d);
            }
        }
        if (liveData[1]) {
            let val = JSON.parse(liveData[1].value);
            for (let item in val) {
                let d = { x: (val[item].x / 100 * iw), y: (val[item].y / 100 * ih), value: 50 };
                prevData.push(d);
            }
        }
        // removing old data points
        heatmap.setData({data: []});
        // adding new data points
        heatmap.addData(prevData);
        // handleAddData(datapoints.current);
        console.log("datapoints: ", prevData);
    }

    const btn1 = () => {
        tempHandle([{
            type: 'human',
            value: '{"0":{"x": 8.714, "y": 12.637, "heading": 0.0},"2":{"x": 21.848, "y": 25.879, "heading": 0.184}}'
        },
        {
            type: 'vehicle',
            value: '{"0":{"x": 7.131, "y": 9.075, "heading": -0.443}}'
        },], []);
    }

    const btn2 = () => {
        tempHandle([{
            type: 'human',
            value: '{"0":{"x": 59, "y": 20, "heading": 0.0},"2":{"x": 21.848, "y": 45, "heading": 0.184}}'
        },
        {
            type: 'vehicle',
            value: '{"0":{"x": 50, "y": 50, "heading": -0.443}}'
        },
        ], []);
    }

    return (
        <div className=" flex flex-col w-[100%] px-5 pb-5 border-0 h-full">
            {/* <button className="bg-red-200 my-1" onClick={btn1}>Btn 1</button>
            <button className="bg-red-200 my-1" onClick={btn2}>Btn 2</button> */}

            <div className="relative border-0 h-full items-center">
                <TransformWrapper
                    minScale={0.1}
                    limitToBounds={false}
                >
                    {({ zoomIn, zoomOut, resetTransform, centerView, ...rest }) => {
                        centerViewFunction = centerView;
                        return (
                            // bg-[#F4F5F4]
                            <React.Fragment>
                                <div className="backStage flex justify-center items-start border-2 overflow-hidden rounded-xl h-full w-full">
                                    <TransformComponent >
                                        <div ref={mount} className="">
                                            <img src={imgSrc} alt="" onLoad={imageLoaded} />
                                        </div>
                                    </TransformComponent>
                                </div>
                                <div className="heatmapButtonBox flex flex-col w-fit sm:w-full sm:flex-row absolute left-4 justify-start mt-5  text-sm">
                                    <button onClick={() => zoomIn()} type="button" className="text-[#10449A] m-1 flex justify-center w-10 py-2 px-4 hover:bg-slate-300 focus:ring-slate-400 focus:ring-offset-slate-200  transition ease-in duration-200 text-center font-semibold heatmapButton focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-xl ">
                                        <BsPlusLg size="20px" />
                                    </button>
                                    <button onClick={() => zoomOut()} type="button" className="text-[#10449A] m-1 flex justify-center w-10 py-2 px-4 hover:bg-slate-300 focus:ring-slate-400 focus:ring-offset-slate-200 transition ease-in duration-200 text-center font-semibold heatmapButton focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-xl ">
                                        <BiMinus size="20px" />
                                    </button>
                                    <button onClick={() => {
                                        mount.current.children[0].dispatchEvent(new Event("load"));
                                        mount.current.style.rotate = "0deg";
                                        mount.current.style.scale = '';
                                    }} type="button" className="text-[#10449A] m-1 flex justify-center py-2 px-4 hover:bg-slate-300 focus:ring-slate-400 focus:ring-offset-slate-200  transition ease-in duration-200 text-center font-semibold heatmapButton focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-xl ">
                                        Reset
                                    </button>
                                    <button onClick={() => rotate(-90)} type="button" className="text-[#10449A] m-1 w-14 py-2 px-4 flex justify-center hover:bg-slate-300 focus:ring-slate-400 focus:ring-offset-slate-200  transition ease-in duration-200 text-center font-semibold heatmapButton focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-xl ">
                                        <BiRotateLeft size="20px" />
                                    </button>
                                    <button onClick={() => rotate(90)} type="button" className="text-[#10449A] m-1 w-14 py-2 px-4 flex justify-center hover:bg-slate-300 focus:ring-slate-400 focus:ring-offset-slate-200  transition ease-in duration-200 text-center font-semibold heatmapButton focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-xl ">
                                        <BiRotateRight size="20px" />
                                    </button>
                                    <button onClick={() => {
                                        mount.current.style.scale = !mount.current.style.scale ? "-1 1" : "";
                                    }} type="button" className="text-[#10449A] m-1 w-14 py-2 px-4 flex justify-center hover:bg-slate-300 focus:ring-slate-400 focus:ring-offset-slate-200  transition ease-in duration-200 text-center font-semibold heatmapButton focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-xl">
                                        <TbFlipHorizontal size="20px" />
                                    </button>
                                </div>
                            </React.Fragment>
                        )
                    }}
                </TransformWrapper>
            </div>
        </div>
    )
}

export default Heatmap