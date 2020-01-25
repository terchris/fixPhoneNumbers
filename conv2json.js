


const csvInputFilePath = 'dummydata/contacts.csv';
const csv = require('csvtojson')

var allRecords = [];
var fixedMobilePhone = "";
var exportArray = [];


const { Parser } = require('json2csv');
 
const fields = ['RecordId', 'FirstName', 'LastName','EmailAddress', 'MobilePhone', 'fixedMobilePhone','Norwegian0047', 'isFixed'];
const opts = { fields };

var fs = require('fs');
const csvOutputFilePath = 'dummydata/contacts-fixed.csv';

var debugCounter =0;


csv()
    .fromFile(csvInputFilePath)
    .then((jsonObj) => {
        //console.log(jsonObj);
        allRecords = jsonObj;
        allRecords.map(currentRecord => {
            debugCounter++;
            //console.log("MobilePhone", currentRecord.MobilePhone);
            fixedMobilePhone = currentRecord.MobilePhone;
            fixedMobilePhone = fixedMobilePhone.replace(/ /g, ''); //remove space
            fixedMobilePhone = fixedMobilePhone.replace(/-/g, ''); // remove -
            fixedMobilePhone = fixedMobilePhone.replace(/,/g, ''); // remove ,

            if (fixedMobilePhone.length == 8) {
                fixedMobilePhone = "+47" + fixedMobilePhone;
                // console.log("Number is fine. Just adding norwegian contry code:", fixedMobilePhone )
                currentRecord.fixedMobilePhone = fixedMobilePhone;
            }
            if ("0047" == fixedMobilePhone.substr(0, 4) && fixedMobilePhone.length == 12) {
                fixedMobilePhone = "+47" + fixedMobilePhone.substr(4);
                // console.log("Number is fine. Just replacing 0047 with +47:", fixedMobilePhone )
                currentRecord.fixedMobilePhone = fixedMobilePhone;
            }

            if ("(+47)" == fixedMobilePhone.substr(0, 5) && fixedMobilePhone.length == 13) {
                fixedMobilePhone = "+47" + fixedMobilePhone.substr(5);
                // console.log("Number is fine. Just replacing (+47) with +47:", fixedMobilePhone )
                currentRecord.fixedMobilePhone = fixedMobilePhone;
            }
            if ("47" == fixedMobilePhone.substr(0, 2) && fixedMobilePhone.length == 10) {
                fixedMobilePhone = "+47" + fixedMobilePhone.substr(2);
                // console.log("Number is fine. Just missing + :", fixedMobilePhone )
                currentRecord.fixedMobilePhone = fixedMobilePhone;
            }

            if (fixedMobilePhone.includes("+47", 3) || fixedMobilePhone.includes("0047", 3)) {
                fixedMobilePhone = "+47" + fixedMobilePhone.substr(2);
                // console.log("Number probably norwegian :", fixedMobilePhone)
                currentRecord.fixedMobilePhone = fixedMobilePhone;
            }


            if ("+" == fixedMobilePhone.substr(0, 1) && "+47" != fixedMobilePhone.substr(0, 3)) {

                //console.log("Foreign number. Assume its fine:", fixedMobilePhone );
                currentRecord.fixedMobilePhone = fixedMobilePhone;
            }


            if ("+47" == fixedMobilePhone.substr(0, 3) && fixedMobilePhone.length == 11) {
                currentRecord.Norwegian0047 = "00" + fixedMobilePhone.substr(1);
                currentRecord.fixedMobilePhone = fixedMobilePhone;
                //    console.log("Valid Norwegian number :", fixedMobilePhone, " count:", orginalValid);
            } else
                if ("+" == fixedMobilePhone.substr(0, 1) && "+47" != fixedMobilePhone.substr(0, 3)) {
                    //console.log("Foreign  :", fixedMobilePhone, " lenght:", fixedMobilePhone.length)
                    currentRecord.fixedMobilePhone = fixedMobilePhone;
                } else {
                    currentRecord.fixedMobilePhone = fixedMobilePhone;
                    console.log(currentRecord.FirstName, " ", currentRecord.LastName, " Fix number:", fixedMobilePhone, " lenght:", fixedMobilePhone.length)
                }

            
            if (currentRecord.MobilePhone != currentRecord.fixedMobilePhone) {
                currentRecord.isFixed = "Yes";
            } else
                currentRecord.isFixed = "No";



        });
        exportArray = allRecords;

    })

    .then((allRecords) => {
        console.log("Then creating array with changes");
        try {
            const parser = new Parser(opts);
            const csv = parser.parse(exportArray);
           // console.log(csv);


            fs.writeFile(csvOutputFilePath, csv, function (err) {
              if (err) throw err;
              console.log('Saved!');
            });

          } catch (err) {
            console.error(err);
          }


    })




            /* need to be done by a human            
                        if ("0047" == fixedMobilePhone.substr(0, 4) && fixedMobilePhone.length >= 12) {
                            tmpNumber = fixedMobilePhone.substr(4,8);
                            if (tmpNumber.length == 8 && Number.isInteger(parseInt(tmpNumber)) ) {
                                fixedMobilePhone = "+47" + tmpNumber;
                                console.log("Number is messy. Starts with 0047 but is to long. Guess correct is", fixedMobilePhone )
                                currentRecord.fixedMobilePhone = fixedMobilePhone;    
                            }
                        }
                        if ("+47" == fixedMobilePhone.substr(0, 3) && fixedMobilePhone.length >= 12) {
                            fixedMobilePhone = "+47" + fixedMobilePhone.substr(3,8);
                            console.log("Number is messy. Starts with +47 but is to long. Guess correct is", fixedMobilePhone )
                            currentRecord.fixedMobilePhone = fixedMobilePhone;
                        }
                        if ("+47" == fixedMobilePhone.substr(0, 3) && fixedMobilePhone.length >= 12) {
                            tmpNumber = fixedMobilePhone.substr(3,8);
                            if (tmpNumber.length == 8 && Number.isInteger(parseInt(tmpNumber)) ) {
                                fixedMobilePhone = "+47" + tmpNumber;
                                console.log("Number is messy. Starts with 0047 but is to long. Guess correct is", fixedMobilePhone )
                                currentRecord.fixedMobilePhone = fixedMobilePhone;    
                            }
                        }
            
            
            */
