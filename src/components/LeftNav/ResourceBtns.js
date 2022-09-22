import React, { useState } from 'react'
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setHeatmapResource } from '../../state/reducers/heatmapResourceReducer';
import ToggleSwith from '../utilities/utilComponents/ToggleSwith'

function ResourceBtns() {
    let dispatch = useDispatch();
    let location = useLocation();
    const [checkHuman, setCheckHuman] = useState(true);
    const [checkVehicle, setCheckVehicle] = useState(true);

    const checked = useRef({
        human: true,
        vehicle: true,
    });

    const handleClick = (type) => {
        if (type === "human")
            checked.current = {
                ...checked.current, human: !checked.current.human
            }
        else
            checked.current = {
                ...checked.current, vehicle: !checked.current.vehicle
            }

        // setting resource type
        if (!checked.current.human && !checked.current.vehicle)
            dispatch(setHeatmapResource({ value: "" }));
        else if(checked.current.human && checked.current.vehicle)
            dispatch(setHeatmapResource({value: 'both'}));
        else if (checked.current.human && !checked.current.vehicle)
            dispatch(setHeatmapResource({ value: "human" }));
        else if (checked.current.vehicle && !checked.current.human)
            dispatch(setHeatmapResource({ value: "vehicle" }));
    }

    return (
        <div>
            <li className='pl-5 my-5 border-0 font-semibold flex items-center'>
                <div>
                    Show Humans : &ensp;
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input disabled={location.pathname.includes("/analytics")} type="checkbox" checked={checkHuman} onChange={() => {
                        handleClick("human");
                        setCheckHuman((prevState) => !prevState);
                        }} name="toggle" id="Blue" className={`${location.pathname.includes("/analytics") ? "opacity-50" : ""} checked:bg-blue-500 outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in-out border-2 absolute block w-6 h-6 rounded-full bg-white appearance-none cursor-pointer`} />
                    <label style={{pointerEvents: 'none'}} htmlFor="Blue" className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer">
                    </label>
                </div>
            </li>
            <li className='pl-5 my-5 border-0 font-semibold flex items-center'>
                <div>
                    Show Vehicles : &ensp;
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input disabled={location.pathname.includes("/analytics")} type="checkbox" checked={checkVehicle} onChange={() => {
                        handleClick("vehicle");
                        setCheckVehicle((prevState) => !prevState);
                        }} name="toggle" id="Blue" className={`${location.pathname.includes("/analytics") ? "opacity-50" : ""} checked:bg-blue-500 outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in-out border-2 absolute block w-6 h-6 rounded-full bg-white appearance-none cursor-pointer`} />
                    <label style={{pointerEvents: 'none'}} htmlFor="Blue" className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer">
                    </label>
                </div>
            </li>
        </div>
    )
}

export default ResourceBtns