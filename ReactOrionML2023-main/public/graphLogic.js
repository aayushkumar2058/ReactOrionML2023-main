json_TxnCollection = {"txn_count":4,"lot_size":50,
"txns":[
     {"txn_index_id":1, "txn_type":"B", "expiry_date":"01-sep-2022","txn_PE_CE":"PE", "strike_price":17500,"iv":16.9,"orig_txn_price":75.55,"lotsize":1,"lotqty" :50},
     {"txn_index_id":1, "txn_type":"S", "expiry_date":"25-aug-2022","txn_PE_CE":"PE", "strike_price":17700,"iv":15.7,"orig_txn_price":75.0,"lotsize":1,"lotqty" :50},
     {"txn_index_id":1, "txn_type":"S", "expiry_date":"25-aug-2022","txn_PE_CE":"CE", "strike_price":18100,"iv":13.9,"orig_txn_price":62.55,"lotsize":1,"lotqty" :50},
     {"txn_index_id":1, "txn_type":"B", "expiry_date":"01-sep-2022","txn_PE_CE":"CE", "strike_price":18300,"iv":13.4,"orig_txn_price":62.3,"lotsize":1,"lotqty" :50}
	]
}

payoff_expiry= payoff_calc_on_expiry(json_TxnCollection);
payoff_current = payoff_calc_current(json_TxnCollection);
// console.log ( payoff_expiry ) ;

data_array_expiry = payoff_expiry.data
data_array_current = payoff_current.data



var xg =[]
var yg =[]
var yg_current =[]

for (let iGIndex = 0; iGIndex < data_array_expiry.length; iGIndex++) {
// console.log ( "Coords are (" + data_array_expiry[iGIndex].index +","+  data_array_expiry[iGIndex].payoff*50 + ")" )
yg.push(data_array_expiry[iGIndex].payoff *50)
yg_current.push(data_array_current[iGIndex].payoff *50)
xg.push(data_array_expiry[iGIndex].index )

}


