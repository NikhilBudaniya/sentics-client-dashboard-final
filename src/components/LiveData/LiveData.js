import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux/es/exports';
import { set } from '../../state/reducers/authReducer';
import Heatmap from '../utilities/Heatmap';
import LiveCards from '../utilities/LiveCards';

// Home component for the live view
function LiveData(props) {
    // sample redux action dispatch
    // dispatch ==> used to dispatch a action
    const dispatch = useDispatch();
    dispatch(set({
        value: "newauthtoken",
    }));

    // useSelector() is used to access any state from the store
    const auth = useSelector((store) => store.auth.value);

    useEffect(() => {
        console.log(auth);
    }, [auth]);
    // ABOVE CODE IS ONLY USAGE DEMONSTRATION OF REDUX-TOOLKIT


    const [liveData, setLiveData] = useState([
        {
            type: 'human',
            value: '{"0":{"x": 8.714, "y": 12.637, "heading": 0.0},"2":{"x": 21.848, "y": 25.879, "heading": 0.184}}'
        },
        {
            type: 'vehicle',
            value: '{"0":{"x": 7.131, "y": 9.075, "heading": -0.443}}'
        },
    ]);


    const fetchLiveData = (resource = "") => {
        // pass resource = "vehicle" or "human" for specific data
        let host = process.env.REACT_APP_NODE_BACKEND_URL || 'http://localhost:5000';
        return new Promise((resolve, reject) => {
            // refer to backend/index.js for details about the endpoint
            axios({
                url: `${host}/api/live`,
                method: 'post',
                data: {
                    source: "mqtt",
                    table: "",
                    resource,
                }
            }).then((res) => {
                // console.log("outer res: ", res.data);
                resolve(res.data);
            }).catch((err) => {
                console.log("promise error: ", err);
                reject(err);
            })
        })
    }

    // useInterval(() => {
    //     fetchLiveData();
    // }, 1000);


    return (
        <div className={`navHeight overflow-hidden`}>
            <div className="h-[15%] max-w-[100%] min-h-[100px]"><LiveCards /></div>
            <div className="h-[85%]"><Heatmap /></div>
            {/* <div className="h-[75%]"><ThreeD /></div> */}
            {/* <Heatmap /> */}
        </div>
    )
}

export default LiveData 