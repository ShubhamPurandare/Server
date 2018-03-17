

var id = "ComputerTESem2C2018";
	var CurrYear = id.substr(-4);

			var main = id.substr(-5);
							var div = main.substr(0 , 1);
							var one = id.substr(-11);
							var year = one.substr(0,2);
							console.log(main );
							console.log(div);
							console.log("dept"+one);
							console.log(year);
							var d = id.length -11;
							var sem = one.substring(2,6);
							console.log(sem + "Sem");
							var dept = id.substr(0 , d);
							console.log(dept);