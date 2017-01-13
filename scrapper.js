var cheerio = require('cheerio');
var unirest = require('unirest');
var free_slots = [];
var login = require("./login");

function scrape() {
    login.doLogin(function (jar) {
        var Request = unirest.get('https://vtop.vit.ac.in/student/course_regular.asp?sem=WS')
            .jar(jar)
            .followRedirect(true)
            .timeout(28000)
            .end(function (res) {
                if (res.error) {
                    // console.log('GET error', res.error)
                } else {
                    console.log("///@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");

                    var Request = unirest.get('https://vtop.vit.ac.in/student/course_regular.asp?sem=WS')
                        .jar(jar)
                        .followRedirect(true)
                        .timeout(28000)
                        .end(slotScrapping)
                    

                    var Request = unirest.get('https://vtop.vit.ac.in/student/home.asp')
                        .jar(jar)
                        .followRedirect(true)
                        .timeout(28000)
                        .end(getName)                
                }
            });
    });

    function getName(res) {
        var $ = cheerio.load(res.body);
        tables = $('table');
        table = $(tables[1]);
        var name = table.find('td').eq(0).text().trim().split(" ")[1].trim() + " " + table.find('td').eq(0).text().trim().split(" ")[2].trim();
        var obj = new Object;
        obj.student_name = name;
        free_slots.push(obj);
    };

   //##########    "FREE  SLOTS(BY mayankagg9722)!!!!!!"

    function slotScrapping(res) {
        var $ = cheerio.load(res.body);
        tables = $('table');
        table = $(tables[2]);
        // console.log(table.text());
        
        for (var i = 2; i < 7; i++) {
            var obj = new Object;
            obj.day = table.find('tr').eq(i).find('td').eq(0).text();
            //  console.log(table.find('tr').eq(i).find('td').eq(0).text());
            var arr = [];
            for (var j = 0; j < table.find('tr').eq(i).find('td').length; j++) {
                if (table.find('tr').eq(i).find('td').eq(j).text().length < 11) {
                    if (j != 7 && !(table.find('tr').eq(0).find('td').eq(j).text() == "THEORY HOURS")) {
                        // console.log(table.find('tr').eq(0).find('td').eq(j).text());
                        if (table.find('tr').eq(0).find('td').eq(j).text().length > 3) {
                            arr.push(table.find('tr').eq(0).find('td').eq(j).text());
                        } else {
                            arr.push(table.find('tr').eq(1).find('td').eq(j).text());
                        }

                    }
                    obj.free_slots = arr;
                }
            }
            free_slots.push(obj);
        }
        console.log(free_slots);
    }

    //##########    "FREE  SLOTS(BY mayankagg9722)!!!!!!" 
}

exports.scrape = scrape;