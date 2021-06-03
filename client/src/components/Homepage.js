
import React, { useEffect } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";





function Homepage() {

    const [options, updateOptions] = React.useState();   //for option fetch
    const [add, updateAdd] = React.useState(false);      //for option map maping
    const [curr, updateCurrent] = React.useState(null);      //for current prices
    const [data, updateData] = React.useState();          //data inside database

    //values releated to bought from inr
    const [name1, updatename1] = React.useState(null);
    const [value1, updatevalue1] = React.useState(null);
    const [vol1, updatevol1] = React.useState(null);

    //values releated to bought from usdt
    const [name2, updatename2] = React.useState(null);
    const [value2, updatevalue2] = React.useState(null);
    const [vol2, updatevol2] = React.useState(null);

    //acknolegement about adding
    const [status1, updateStatus1] = React.useState("----Add your new coin---");
    const [allow, updateAllow] = React.useState(false);
    const [allow2, updateAllow2] = React.useState(false);
    var [oval, updatesoval] = React.useState("...loading...");
    const[fetcher,updatefetcher] = React.useState("Not Fetched");




    async function fetchData() {                 //only for select options for adding coin
        
        const res = await fetch("/getNames");
        res
            .json()
            .then((res) => {
                updateOptions(res.markets);
                updateAdd(true);


            });
    }


    async function fetchDatabase() {             //for data inside database
        
        const res = await fetch("/getd");
        res
            .json()
            .then((res) => {

                updateData(res);
                updateAllow(true);
            });
    }
    async function fetchCurrent() {             //for current value of all coins
        
        const res = await fetch("/getcurr");
        res
            .json()
            .then((res) => {
                updateCurrent(res);
                updateAllow2(true);
                var sum1=0;var sum2=0;
                var num = 0;
                
                if(allow == true){
                    const got = data.foundItems;

                    got.forEach((item) => {

                       if(curr.hasOwnProperty(item.coin_name)){
                        sum1=eval(sum1 + (item.AtValue*item.volume));
                        num=parseFloat(curr[item.coin_name].sell);
                        sum2=eval(sum2 + (num*item.volume));
               
                        }
                       
                      });
                      var per =(((sum2-sum1)/sum1)*100);
                      per= per.toFixed(2);
                 
                    updatesoval(per);

                }
  

                
                updatefetcher("Fetched");
              
            });
    }
    async function delData(date, time) {             //for current value of all coins
        console.log("requesting delete " + date + " " + time);
        const res = await fetch("/deldata?date=" + date + "&time=" + time);
        res
            .json()
            .then((res) => {
                console.log(res.code);
                fetchDatabase();
               
            });
    }


    async function fillData(coinname, atvalue, vol) {               //for filling data into database

        console.log("from filldata ->" + coinname + " " + atvalue + " " + vol);

        const res = await fetch("/filldata/?coinname=" + coinname + "&atvalue=" + atvalue + "&volume=" + vol);
        res
            .json()
            .then((res) => {

                updateStatus1(res.msg);
                setTimeout(() => {
                    updateStatus1("----Add new Coin----");
                }, 3000);
                fetchDatabase();
                fetchCurrent();

            });
    }

    useEffect(() => {

        fetchData();
        fetchDatabase();
        fetchCurrent();

    }, []);


    const renderTime = ({ remainingTime }) => {
        if (remainingTime === 0) {

            fetchCurrent();
            updatefetcher("Fetching");

            return <div className="timer"><i class="fa fa-globe" style={{ fontSize: "500%", color: "grey" }} aria-hidden="true"></i> <br /> Refreshing...</div>;
        }

        return (
            <div className="timer">
                <div className="text">Remaining</div>
                <div className="value">{remainingTime}</div>
                <div className="text">seconds</div>
            </div>
        );
    };





    function createOption1(option) {
        if (option.quoteMarket === "inr")
            return <option value={option.baseMarket + option.quoteMarket}>{option.baseMarket + "/" + option.quoteMarket}</option>
    }
    function createOption2(option) {
        if (option.quoteMarket === "usdt")
            return <option value={option.baseMarket + option.quoteMarket}>{option.baseMarket + "/" + option.quoteMarket}</option>
    }


    function handleClick1() {
        if (name1 != null && vol1 > 0 && value1 > 0) {


            fillData(name1, value1, vol1);
           

        } else {
            updateStatus1("Please fill Data Correctly --- And try again");
        }
        updatename1(null); updatevol1(""); updatevalue1("");

    }
    function handleClick2() {
        if (name2 != null && vol2 > 0 && value2 > 0) {

            fillData(name2, value2, vol2);
          

        } else {
            updateStatus1("Please fill Data Correctly --- And try again");
        }
        updatename2(null); updatevol2(""); updatevalue2("");
    }


    function createRows(data) {

        const find = data.coin_name;
        var name;
        var coin;
        var currPrice; var boughtValue; var pnl; var per; var currval;
        
        if (data.coin_name.charAt(data.coin_name.length - 1) === 'r') {
            var sym = '₹'; name = find.substring(0, find.length - 3)
        }
        else {
            name = find.substring(0, find.length - 4);
            var sym = '$';
        }

        name = name.toUpperCase();

        if (curr.hasOwnProperty(find)) {
            coin = curr[find];
            currPrice = coin.sell;
            boughtValue = data.volume * data.AtValue; currval = currPrice * data.volume;
            pnl = currval - boughtValue;
            per = ((pnl / boughtValue) * 100);



            per = per.toFixed(2);
            pnl = pnl.toFixed(2);
            boughtValue = boughtValue.toFixed(2);
            currval = currval.toFixed(2);
     
        
           

        }
        else {

            coin = 0;
            currPrice = "Fetching Error";
            boughtValue = "Fetching Error";
            pnl = "Fetching Error";
            per = "Fetching Error";

        }

        if (pnl < 0) {
            return <tr id="dataRow" style={{ backgroundColor: "red", color: "white" }}>
                <th>{name}</th>
                <td>{data.date + " " + data.time}</td>
                <td>{sym}{data.AtValue}</td>
                <td>{data.volume}</td>
                <td>{sym}{currPrice}</td>
                <td>{sym}{boughtValue}</td>
                <td>{sym}{currval}</td>
                <td>{sym}{pnl}</td>
                <td>{per}%</td>

                <td>
                    <button class="btn bg-transparent" style={{ color: "white", borderColor: "white" }} onClick={() => { delData(data.date, data.time); }}>  <i class="fa fa-trash" aria-hidden="true"></i> </button>
                </td>
            </tr>;
        } else {
            return <tr id="dataRow" style={{ backgroundColor: "green", color: "white" }}>
                <th>{name}</th>
                <td>{data.date + " " + data.time}</td>
                <td>{sym}{data.AtValue}</td>
                <td>{data.volume}</td>
                <td>{sym}{currPrice}</td>
                <td>{sym}{boughtValue}</td>
                <td>{sym}{currval}</td>
                <td>{sym}{pnl}</td>
                <td>{per}%</td>

                <td>
                    <button class="btn bg-transparent" style={{ color: "white", borderColor: "white" }} onClick={() => { delData(data.date, data.time); }}>  <i class="fa fa-trash" aria-hidden="true"></i> </button>
                </td>
            </tr>;

        }
    }




    return (
        <div className="dim" style={{ textAlign: "center" }}>

            <h1>Portfolio Manager (wazirX)</h1>
            <div class="row" >
                <div class="col" >
                    <div class="row">
                        <div class="col">
                            <h2>Bought from INR</h2>
                            <select id="cars" name="cars" value={name1} onChange={(event) => { updatename1(event.target.value) }} >
                                <option value="" disabled selected hidden>select Coin</option>
                                {(add === true) ? options.map(createOption1) :
                                    <h2>loading</h2>
                                }
                            </select>
                        </div>
                        <div class="col">
                            <h2>volume</h2>
                            <input type="Number" placeholder="fill vol" value={vol1} onChange={(event) => { updatevol1(event.target.value) }} ></input>
                        </div>
                        <div class="col">
                            <h2>at price</h2>
                            <input type="Number" placeholder="at price" value={value1} onChange={(event) => { updatevalue1(event.target.value) }} ></input>
                        </div>
                    </div>
                    <div >
                        <button class="btn btn-primary" style={{ left: "100px", right: "100px" }} onClick={handleClick1}>Add</button>
                    </div>
                </div>
                <div class="col" style={{ borderLeft: "6px solid blue" }}>
                    <div class="row">
                        <div class="col">
                            <h2>Bought from USDT</h2>
                            <select id="cars" name="cars" value={name2} onChange={(event) => { updatename2(event.target.value) }} >
                                <option value="" disabled selected hidden>select Coin</option>
                                {(add === false) ? <h2>loading</h2> :
                                    options.map(createOption2)
                                }
                            </select>
                        </div>
                        <div class="col">
                            <h2>volume</h2>
                            <input type="Number" placeholder="fill vol" value={vol2} onChange={(event) => { updatevol2(event.target.value) }} ></input>
                        </div>
                        <div class="col">
                            <h2>at price</h2>
                            <input type="Number" placeholder="at price" value={value2} onChange={(event) => { updatevalue2(event.target.value) }} ></input>
                        </div>
                    </div>
                    <div >
                        <button class="btn btn-primary" style={{ left: "100px", right: "100px" }} onClick={handleClick2}>Add</button>
                    </div>
                </div>

            </div>
            <h1>{status1}</h1>


            <div class="row" style={{ padding: "1%" }}>
                <div class="col-xs-9">
                    <table class="table table-bordered" >
                        <thead>
                            <tr id="dataColumns">
                                <th scope="col">Coin Name</th>
                                <th scope="col">Added On</th>
                                <th scope="col">At-Price</th>
                                <th scope="col">Volume</th>
                                <th scope="col">CurrPrice</th>
                                <th scope="col">Bought Value</th>
                                <th scope="col">Current Value</th>
                                <th scope="col">Profit/Loss</th>
                                <th scope="col">Profit/Loss (%)</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(allow === true && allow2 === true) ? (data.code === 1) ?
                                data.foundItems.map(createRows) :
                                <h1>You must add coin to your data base</h1>
                                : <h1>Data Not Available</h1>}
                        </tbody>
                    </table>
                </div>
                <div class="col" style={{ width: "100%", height: "100%", textAlign: "center" }}>
                    <h1>Refresh Timer </h1>
                    <p style={{ textAlign: "center", paddingLeft: "28%" }}>

                        <CountdownCircleTimer
                            isPlaying
                            duration={10}
                            colors={[["#004777", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
                            onComplete={() => [true, 2000]}
                        >
                            {renderTime}
                        </CountdownCircleTimer>


                    </p>

                    <a href="https://www.wazirx.com" target="_blank"> <button class="btn btn-primary" style={{ left: "100px", right: "100px" }}>Go To wazirX</button></a>

                    <h2>Overall actual G/L</h2>
                    {
                        ((oval) < 0) ? <p style={{ color: "whitesmoke", textShadow: "2px 2px 8px red", backgroundColor: "grey",fontSize:"1.8em"}}> {oval}%</p> :
                            <p style={{ color: "whitesmoke", textShadow: "2px 2px 8px green", backgroundColor: "grey",fontSize:"1.8em" }}>{oval}%</p>
                    }
                    
                
                    {fetcher}


                </div>

            </div>


        </div>



    );
}

export default Homepage;