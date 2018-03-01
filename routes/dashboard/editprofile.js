var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var session = require('express-session');
var path = require('path');
var appRoot = require('app-root-path');
appRoot = appRoot.toString();
var request = require('request');
var multer = require('multer')
// var upload = multer({ dest: 'uploads/' })
var app = express();
var md5 = require('md5');
var User = require('../../models/user');
var libSetting = require('../../lib/setting');
var devMode = libSetting.devMode;
var Country = require('../../models/country');
var hostServer = libSetting.hostServer;
var fs = require('fs');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(appRoot, 'public', 'themes/img/profile'))
    },
    filename: function (req, file, cb) {
        cb(null, md5(Date.now()) + "." + file.originalname.split('.').pop().toLowerCase())
    }
})

var uploading = multer({
    storage: storage
});

function checkAdmin(req, res, next) {
    if (req.session.iduser) {
        next();
    } else {
        res.redirect('/login');
    }
}

router.get('/editprofile', checkAdmin, (req, res) => {
    try {
        User.findOne({
            id: req.session.iduser
        }, (err, result) => {
            // console.log("user update :" + result);
            if (err) {
                console.log(err)
            }
            // console.log(result.country)
            var textcountry;
            Country.findOne({
                idcountry: result.country
            }, (err, data) => {
                console.log(data)
                if (err) {
                    console.log(err)
                }
                var urlimg;
                if (!data) {
                    Country.insertMany([{
                            idcountry: '1',
                            countryName: 'Afghanistan',
                            IOScode: 'AF'
                        },
                        {
                            idcountry: '2',
                            countryName: 'Åland Islands',
                            IOScode: 'AX'
                        },
                        {
                            idcountry: '3',
                            countryName: 'Albania',
                            IOScode: 'AL'
                        },
                        {
                            idcountry: '4',
                            countryName: 'Algeria',
                            IOScode: 'DZ'
                        },
                        {
                            idcountry: '5',
                            countryName: 'American Samoa',
                            IOScode: 'AS'
                        },
                        {
                            idcountry: '6',
                            countryName: 'AndorrA',
                            IOScode: 'AD'
                        },
                        {
                            idcountry: '7',
                            countryName: 'Angola',
                            IOScode: 'AO'
                        },
                        {
                            idcountry: '8',
                            countryName: 'Anguilla',
                            IOScode: 'AI'
                        },
                        {
                            idcountry: '9',
                            countryName: 'Antarctica',
                            IOScode: 'AQ'
                        },
                        {
                            idcountry: '10',
                            countryName: 'Antigua and Barbuda',
                            IOScode: 'AG'
                        },
                        {
                            idcountry: '11',
                            countryName: 'Argentina',
                            IOScode: 'AR'
                        },
                        {
                            idcountry: '12',
                            countryName: 'Armenia',
                            IOScode: 'AM'
                        },
                        {
                            idcountry: '13',
                            countryName: 'Aruba',
                            IOScode: 'AW'
                        },
                        {
                            idcountry: '14',
                            countryName: 'Australia',
                            IOScode: 'AU'
                        },
                        {
                            idcountry: '15',
                            countryName: 'Austria',
                            IOScode: 'AT'
                        },
                        {
                            idcountry: '16',
                            countryName: 'Azerbaijan',
                            IOScode: 'AZ'
                        },
                        {
                            idcountry: '17',
                            countryName: 'Bahamas',
                            IOScode: 'BS'
                        },
                        {
                            idcountry: '18',
                            countryName: 'Bahrain',
                            IOScode: 'BH'
                        },
                        {
                            idcountry: '19',
                            countryName: 'Bangladesh',
                            IOScode: 'BD'
                        },
                        {
                            idcountry: '20',
                            countryName: 'Barbados',
                            IOScode: 'BB'
                        },
                        {
                            idcountry: '21',
                            countryName: 'Belarus',
                            IOScode: 'BY'
                        },
                        {
                            idcountry: '22',
                            countryName: 'Belgium',
                            IOScode: 'BE'
                        },
                        {
                            idcountry: '23',
                            countryName: 'Belize',
                            IOScode: 'BZ'
                        },
                        {
                            idcountry: '24',
                            countryName: 'Benin',
                            IOScode: 'BJ'
                        },
                        {
                            idcountry: '25',
                            countryName: 'Bermuda',
                            IOScode: 'BM'
                        },
                        {
                            idcountry: '26',
                            countryName: 'Bhutan',
                            IOScode: 'BT'
                        },
                        {
                            idcountry: '27',
                            countryName: 'Bolivia',
                            IOScode: 'BO'
                        },
                        {
                            idcountry: '28',
                            countryName: 'Bosnia and Herzegovina',
                            IOScode: 'BA'
                        },
                        {
                            idcountry: '29',
                            countryName: 'Botswana',
                            IOScode: 'BW'
                        },
                        {
                            idcountry: '30',
                            countryName: 'Bouvet Island',
                            IOScode: 'BV'
                        },
                        {
                            idcountry: '31',
                            countryName: 'Brazil',
                            IOScode: 'BR'
                        },
                        {
                            idcountry: '32',
                            countryName: 'British Indian Ocean Territory',
                            IOScode: 'IO'
                        },
                        {
                            idcountry: '33',
                            countryName: 'Brunei Darussalam',
                            IOScode: 'BN'
                        },
                        {
                            idcountry: '34',
                            countryName: 'Bulgaria',
                            IOScode: 'BG'
                        },
                        {
                            idcountry: '35',
                            countryName: 'Burkina Faso',
                            IOScode: 'BF'
                        },
                        {
                            idcountry: '36',
                            countryName: 'Burundi',
                            IOScode: 'BI'
                        },
                        {
                            idcountry: '37',
                            countryName: 'Cambodia',
                            IOScode: 'KH'
                        },
                        {
                            idcountry: '38',
                            countryName: 'Cameroon',
                            IOScode: 'CM'
                        },
                        {
                            idcountry: '39',
                            countryName: 'Canada',
                            IOScode: 'CA'
                        },
                        {
                            idcountry: '40',
                            countryName: 'Cape Verde',
                            IOScode: 'CV'
                        },
                        {
                            idcountry: '41',
                            countryName: 'Cayman Islands',
                            IOScode: 'KY'
                        },
                        {
                            idcountry: '42',
                            countryName: 'Central African Republic',
                            IOScode: 'CF'
                        },
                        {
                            idcountry: '43',
                            countryName: 'Chad',
                            IOScode: 'TD'
                        },
                        {
                            idcountry: '44',
                            countryName: 'Chile',
                            IOScode: 'CL'
                        },
                        {
                            idcountry: '45',
                            countryName: 'China',
                            IOScode: 'CN'
                        },
                        {
                            idcountry: '46',
                            countryName: 'Christmas Island',
                            IOScode: 'CX'
                        },
                        {
                            idcountry: '47',
                            countryName: 'Cocos (Keeling) Islands',
                            IOScode: 'CC'
                        },
                        {
                            idcountry: '48',
                            countryName: 'Colombia',
                            IOScode: 'CO'
                        },
                        {
                            idcountry: '49',
                            countryName: 'Comoros',
                            IOScode: 'KM'
                        },
                        {
                            idcountry: '50',
                            countryName: 'Congo',
                            IOScode: 'CG'
                        },
                        {
                            idcountry: '51',
                            countryName: 'Congo, The Democratic Republic of the',
                            IOScode: 'CD'
                        },
                        {
                            idcountry: '52',
                            countryName: 'Cook Islands',
                            IOScode: 'CK'
                        },
                        {
                            idcountry: '53',
                            countryName: 'Costa Rica',
                            IOScode: 'CR'
                        },
                        {
                            idcountry: '54',
                            countryName: 'Cote D\'Ivoire',
                            IOScode: 'CI'
                        },
                        {
                            idcountry: '55',
                            countryName: 'Croatia',
                            IOScode: 'HR'
                        },
                        {
                            idcountry: '56',
                            countryName: 'Cuba',
                            IOScode: 'CU'
                        },
                        {
                            idcountry: '57',
                            countryName: 'Cyprus',
                            IOScode: 'CY'
                        },
                        {
                            idcountry: '58',
                            countryName: 'Czech Republic',
                            IOScode: 'CZ'
                        },
                        {
                            idcountry: '59',
                            countryName: 'Denmark',
                            IOScode: 'DK'
                        },
                        {
                            idcountry: '60',
                            countryName: 'Djibouti',
                            IOScode: 'DJ'
                        },
                        {
                            idcountry: '61',
                            countryName: 'Dominica',
                            IOScode: 'DM'
                        },
                        {
                            idcountry: '62',
                            countryName: 'Dominican Republic',
                            IOScode: 'DO'
                        },
                        {
                            idcountry: '63',
                            countryName: 'Ecuador',
                            IOScode: 'EC'
                        },
                        {
                            idcountry: '64',
                            countryName: 'Egypt',
                            IOScode: 'EG'
                        },
                        {
                            idcountry: '65',
                            countryName: 'El Salvador',
                            IOScode: 'SV'
                        },
                        {
                            idcountry: '66',
                            countryName: 'Equatorial Guinea',
                            IOScode: 'GQ'
                        },
                        {
                            idcountry: '67',
                            countryName: 'Eritrea',
                            IOScode: 'ER'
                        },
                        {
                            idcountry: '68',
                            countryName: 'Estonia',
                            IOScode: 'EE'
                        },
                        {
                            idcountry: '69',
                            countryName: 'Ethiopia',
                            IOScode: 'ET'
                        },
                        {
                            idcountry: '70',
                            countryName: 'Falkland Islands (Malvinas)',
                            IOScode: 'FK'
                        },
                        {
                            idcountry: '71',
                            countryName: 'Faroe Islands',
                            IOScode: 'FO'
                        },
                        {
                            idcountry: '72',
                            countryName: 'Fiji',
                            IOScode: 'FJ'
                        },
                        {
                            idcountry: '73',
                            countryName: 'Finland',
                            IOScode: 'FI'
                        },
                        {
                            idcountry: '74',
                            countryName: 'France',
                            IOScode: 'FR'
                        },
                        {
                            idcountry: '75',
                            countryName: 'French Guiana',
                            IOScode: 'GF'
                        },
                        {
                            idcountry: '76',
                            countryName: 'French Polynesia',
                            IOScode: 'PF'
                        },
                        {
                            idcountry: '77',
                            countryName: 'French Southern Territories',
                            IOScode: 'TF'
                        },
                        {
                            idcountry: '78',
                            countryName: 'Gabon',
                            IOScode: 'GA'
                        },
                        {
                            idcountry: '79',
                            countryName: 'Gambia',
                            IOScode: 'GM'
                        },
                        {
                            idcountry: '80',
                            countryName: 'Georgia',
                            IOScode: 'GE'
                        },
                        {
                            idcountry: '81',
                            countryName: 'Germany',
                            IOScode: 'DE'
                        },
                        {
                            idcountry: '82',
                            countryName: 'Ghana',
                            IOScode: 'GH'
                        },
                        {
                            idcountry: '83',
                            countryName: 'Gibraltar',
                            IOScode: 'GI'
                        },
                        {
                            idcountry: '84',
                            countryName: 'Greece',
                            IOScode: 'GR'
                        },
                        {
                            idcountry: '85',
                            countryName: 'Greenland',
                            IOScode: 'GL'
                        },
                        {
                            idcountry: '86',
                            countryName: 'Grenada',
                            IOScode: 'GD'
                        },
                        {
                            idcountry: '87',
                            countryName: 'Guadeloupe',
                            IOScode: 'GP'
                        },
                        {
                            idcountry: '88',
                            countryName: 'Guam',
                            IOScode: 'GU'
                        },
                        {
                            idcountry: '89',
                            countryName: 'Guatemala',
                            IOScode: 'GT'
                        },
                        {
                            idcountry: '90',
                            countryName: 'Guernsey',
                            IOScode: 'GG'
                        },
                        {
                            idcountry: '91',
                            countryName: 'Guinea',
                            IOScode: 'GN'
                        },
                        {
                            idcountry: '92',
                            countryName: 'Guinea-Bissau',
                            IOScode: 'GW'
                        },
                        {
                            idcountry: '93',
                            countryName: 'Guyana',
                            IOScode: 'GY'
                        },
                        {
                            idcountry: '94',
                            countryName: 'Haiti',
                            IOScode: 'HT'
                        },
                        {
                            idcountry: '95',
                            countryName: 'Heard Island and Mcdonald Islands',
                            IOScode: 'HM'
                        },
                        {
                            idcountry: '96',
                            countryName: 'Holy See (Vatican City State)',
                            IOScode: 'VA'
                        },
                        {
                            idcountry: '97',
                            countryName: 'Honduras',
                            IOScode: 'HN'
                        },
                        {
                            idcountry: '98',
                            countryName: 'Hong Kong',
                            IOScode: 'HK'
                        },
                        {
                            idcountry: '99',
                            countryName: 'Hungary',
                            IOScode: 'HU'
                        },
                        {
                            idcountry: '100',
                            countryName: 'Iceland',
                            IOScode: 'IS'
                        },
                        {
                            idcountry: '101',
                            countryName: 'India',
                            IOScode: 'IN'
                        },
                        {
                            idcountry: '102',
                            countryName: 'Indonesia',
                            IOScode: 'ID'
                        },
                        {
                            idcountry: '103',
                            countryName: 'Iran, Islamic Republic Of',
                            IOScode: 'IR'
                        },
                        {
                            idcountry: '104',
                            countryName: 'Iraq',
                            IOScode: 'IQ'
                        },
                        {
                            idcountry: '105',
                            countryName: 'Ireland',
                            IOScode: 'IE'
                        },
                        {
                            idcountry: '106',
                            countryName: 'Isle of Man',
                            IOScode: 'IM'
                        },
                        {
                            idcountry: '107',
                            countryName: 'Israel',
                            IOScode: 'IL'
                        },
                        {
                            idcountry: '108',
                            countryName: 'Italy',
                            IOScode: 'IT'
                        },
                        {
                            idcountry: '109',
                            countryName: 'Jamaica',
                            IOScode: 'JM'
                        },
                        {
                            idcountry: '110',
                            countryName: 'Japan',
                            IOScode: 'JP'
                        },
                        {
                            idcountry: '111',
                            countryName: 'Jersey',
                            IOScode: 'JE'
                        },
                        {
                            idcountry: '112',
                            countryName: 'Jordan',
                            IOScode: 'JO'
                        },
                        {
                            idcountry: '113',
                            countryName: 'Kazakhstan',
                            IOScode: 'KZ'
                        },
                        {
                            idcountry: '114',
                            countryName: 'Kenya',
                            IOScode: 'KE'
                        },
                        {
                            idcountry: '115',
                            countryName: 'Kiribati',
                            IOScode: 'KI'
                        },
                        {
                            idcountry: '116',
                            countryName: 'Korea, Democratic People\'S Republic of',
                            IOScode: 'KP'
                        },
                        {
                            idcountry: '117',
                            countryName: 'Korea, Republic of',
                            IOScode: 'KR'
                        },
                        {
                            idcountry: '118',
                            countryName: 'Kuwait',
                            IOScode: 'KW'
                        },
                        {
                            idcountry: '119',
                            countryName: 'Kyrgyzstan',
                            IOScode: 'KG'
                        },
                        {
                            idcountry: '120',
                            countryName: 'Lao People\'S Democratic Republic',
                            IOScode: 'LA'
                        },
                        {
                            idcountry: '121',
                            countryName: 'Latvia',
                            IOScode: 'LV'
                        },
                        {
                            idcountry: '122',
                            countryName: 'Lebanon',
                            IOScode: 'LB'
                        },
                        {
                            idcountry: '123',
                            countryName: 'Lesotho',
                            IOScode: 'LS'
                        },
                        {
                            idcountry: '124',
                            countryName: 'Liberia',
                            IOScode: 'LR'
                        },
                        {
                            idcountry: '125',
                            countryName: 'Libyan Arab Jamahiriya',
                            IOScode: 'LY'
                        },
                        {
                            idcountry: '126',
                            countryName: 'Liechtenstein',
                            IOScode: 'LI'
                        },
                        {
                            idcountry: '127',
                            countryName: 'Lithuania',
                            IOScode: 'LT'
                        },
                        {
                            idcountry: '128',
                            countryName: 'Luxembourg',
                            IOScode: 'LU'
                        },
                        {
                            idcountry: '129',
                            countryName: 'Macao',
                            IOScode: 'MO'
                        },
                        {
                            idcountry: '130',
                            countryName: 'Macedonia, The Former Yugoslav Republic of',
                            IOScode: 'MK'
                        },
                        {
                            idcountry: '131',
                            countryName: 'Madagascar',
                            IOScode: 'MG'
                        },
                        {
                            idcountry: '132',
                            countryName: 'Malawi',
                            IOScode: 'MW'
                        },
                        {
                            idcountry: '133',
                            countryName: 'Malaysia',
                            IOScode: 'MY'
                        },
                        {
                            idcountry: '134',
                            countryName: 'Maldives',
                            IOScode: 'MV'
                        },
                        {
                            idcountry: '135',
                            countryName: 'Mali',
                            IOScode: 'ML'
                        },
                        {
                            idcountry: '136',
                            countryName: 'Malta',
                            IOScode: 'MT'
                        },
                        {
                            idcountry: '137',
                            countryName: 'Marshall Islands',
                            IOScode: 'MH'
                        },
                        {
                            idcountry: '138',
                            countryName: 'Martinique',
                            IOScode: 'MQ'
                        },
                        {
                            idcountry: '139',
                            countryName: 'Mauritania',
                            IOScode: 'MR'
                        },
                        {
                            idcountry: '140',
                            countryName: 'Mauritius',
                            IOScode: 'MU'
                        },
                        {
                            idcountry: '141',
                            countryName: 'Mayotte',
                            IOScode: 'YT'
                        },
                        {
                            idcountry: '142',
                            countryName: 'Mexico',
                            IOScode: 'MX'
                        },
                        {
                            idcountry: '143',
                            countryName: 'Micronesia, Federated States of',
                            IOScode: 'FM'
                        },
                        {
                            idcountry: '144',
                            countryName: 'Moldova, Republic of',
                            IOScode: 'MD'
                        },
                        {
                            idcountry: '145',
                            countryName: 'Monaco',
                            IOScode: 'MC'
                        },
                        {
                            idcountry: '146',
                            countryName: 'Mongolia',
                            IOScode: 'MN'
                        },
                        {
                            idcountry: '147',
                            countryName: 'Montserrat',
                            IOScode: 'MS'
                        },
                        {
                            idcountry: '148',
                            countryName: 'Morocco',
                            IOScode: 'MA'
                        },
                        {
                            idcountry: '149',
                            countryName: 'Mozambique',
                            IOScode: 'MZ'
                        },
                        {
                            idcountry: '150',
                            countryName: 'Myanmar',
                            IOScode: 'MM'
                        },
                        {
                            idcountry: '151',
                            countryName: 'Namibia',
                            IOScode: 'NA'
                        },
                        {
                            idcountry: '152',
                            countryName: 'Nauru',
                            IOScode: 'NR'
                        },
                        {
                            idcountry: '153',
                            countryName: 'Nepal',
                            IOScode: 'NP'
                        },
                        {
                            idcountry: '154',
                            countryName: 'Netherlands',
                            IOScode: 'NL'
                        },
                        {
                            idcountry: '155',
                            countryName: 'Netherlands Antilles',
                            IOScode: 'AN'
                        },
                        {
                            idcountry: '156',
                            countryName: 'New Caledonia',
                            IOScode: 'NC'
                        },
                        {
                            idcountry: '157',
                            countryName: 'New Zealand',
                            IOScode: 'NZ'
                        },
                        {
                            idcountry: '158',
                            countryName: 'Nicaragua',
                            IOScode: 'NI'
                        },
                        {
                            idcountry: '159',
                            countryName: 'Niger',
                            IOScode: 'NE'
                        },
                        {
                            idcountry: '160',
                            countryName: 'Nigeria',
                            IOScode: 'NG'
                        },
                        {
                            idcountry: '161',
                            countryName: 'Niue',
                            IOScode: 'NU'
                        },
                        {
                            idcountry: '162',
                            countryName: 'Norfolk Island',
                            IOScode: 'NF'
                        },
                        {
                            idcountry: '163',
                            countryName: 'Northern Mariana Islands',
                            IOScode: 'MP'
                        },
                        {
                            idcountry: '164',
                            countryName: 'Norway',
                            IOScode: 'NO'
                        },
                        {
                            idcountry: '165',
                            countryName: 'Oman',
                            IOScode: 'OM'
                        },
                        {
                            idcountry: '166',
                            countryName: 'Pakistan',
                            IOScode: 'PK'
                        },
                        {
                            idcountry: '167',
                            countryName: 'Palau',
                            IOScode: 'PW'
                        },
                        {
                            idcountry: '168',
                            countryName: 'Palestinian Territory, Occupied',
                            IOScode: 'PS'
                        },
                        {
                            idcountry: '169',
                            countryName: 'Panama',
                            IOScode: 'PA'
                        },
                        {
                            idcountry: '170',
                            countryName: 'Papua New Guinea',
                            IOScode: 'PG'
                        },
                        {
                            idcountry: '171',
                            countryName: 'Paraguay',
                            IOScode: 'PY'
                        },
                        {
                            idcountry: '172',
                            countryName: 'Peru',
                            IOScode: 'PE'
                        },
                        {
                            idcountry: '173',
                            countryName: 'Philippines',
                            IOScode: 'PH'
                        },
                        {
                            idcountry: '174',
                            countryName: 'Pitcairn',
                            IOScode: 'PN'
                        },
                        {
                            idcountry: '175',
                            countryName: 'Poland',
                            IOScode: 'PL'
                        },
                        {
                            idcountry: '176',
                            countryName: 'Portugal',
                            IOScode: 'PT'
                        },
                        {
                            idcountry: '177',
                            countryName: 'Puerto Rico',
                            IOScode: 'PR'
                        },
                        {
                            idcountry: '178',
                            countryName: 'Qatar',
                            IOScode: 'QA'
                        },
                        {
                            idcountry: '179',
                            countryName: 'Reunion',
                            IOScode: 'RE'
                        },
                        {
                            idcountry: '180',
                            countryName: 'Romania',
                            IOScode: 'RO'
                        },
                        {
                            idcountry: '181',
                            countryName: 'Russian Federation',
                            IOScode: 'RU'
                        },
                        {
                            idcountry: '182',
                            countryName: 'RWANDA',
                            IOScode: 'RW'
                        },
                        {
                            idcountry: '183',
                            countryName: 'Saint Helena',
                            IOScode: 'SH'
                        },
                        {
                            idcountry: '184',
                            countryName: 'Saint Kitts and Nevis',
                            IOScode: 'KN'
                        },
                        {
                            idcountry: '185',
                            countryName: 'Saint Lucia',
                            IOScode: 'LC'
                        },
                        {
                            idcountry: '186',
                            countryName: 'Saint Pierre and Miquelon',
                            IOScode: 'PM'
                        },
                        {
                            idcountry: '187',
                            countryName: 'Saint Vincent and the Grenadines',
                            IOScode: 'VC'
                        },
                        {
                            idcountry: '188',
                            countryName: 'Samoa',
                            IOScode: 'WS'
                        },
                        {
                            idcountry: '189',
                            countryName: 'San Marino',
                            IOScode: 'SM'
                        },
                        {
                            idcountry: '190',
                            countryName: 'Sao Tome and Principe',
                            IOScode: 'ST'
                        },
                        {
                            idcountry: '191',
                            countryName: 'Saudi Arabia',
                            IOScode: 'SA'
                        },
                        {
                            idcountry: '192',
                            countryName: 'Senegal',
                            IOScode: 'SN'
                        },
                        {
                            idcountry: '193',
                            countryName: 'Serbia and Montenegro',
                            IOScode: 'CS'
                        },
                        {
                            idcountry: '194',
                            countryName: 'Seychelles',
                            IOScode: 'SC'
                        },
                        {
                            idcountry: '195',
                            countryName: 'Sierra Leone',
                            IOScode: 'SL'
                        },
                        {
                            idcountry: '196',
                            countryName: 'Singapore',
                            IOScode: 'SG'
                        },
                        {
                            idcountry: '197',
                            countryName: 'Slovakia',
                            IOScode: 'SK'
                        },
                        {
                            idcountry: '198',
                            countryName: 'Slovenia',
                            IOScode: 'SI'
                        },
                        {
                            idcountry: '199',
                            countryName: 'Solomon Islands',
                            IOScode: 'SB'
                        },
                        {
                            idcountry: '200',
                            countryName: 'Somalia',
                            IOScode: 'SO'
                        },
                        {
                            idcountry: '201',
                            countryName: 'South Africa',
                            IOScode: 'ZA'
                        },
                        {
                            idcountry: '202',
                            countryName: 'South Georgia and the South Sandwich Islands',
                            IOScode: 'GS'
                        },
                        {
                            idcountry: '203',
                            countryName: 'Spain',
                            IOScode: 'ES'
                        },
                        {
                            idcountry: '204',
                            countryName: 'Sri Lanka',
                            IOScode: 'LK'
                        },
                        {
                            idcountry: '205',
                            countryName: 'Sudan',
                            IOScode: 'SD'
                        },
                        {
                            idcountry: '206',
                            countryName: 'SuricountryName',
                            IOScode: 'SR'
                        },
                        {
                            idcountry: '207',
                            countryName: 'Svalbard and Jan Mayen',
                            IOScode: 'SJ'
                        },
                        {
                            idcountry: '208',
                            countryName: 'Swaziland',
                            IOScode: 'SZ'
                        },
                        {
                            idcountry: '209',
                            countryName: 'Sweden',
                            IOScode: 'SE'
                        },
                        {
                            idcountry: '210',
                            countryName: 'Switzerland',
                            IOScode: 'CH'
                        },
                        {
                            idcountry: '211',
                            countryName: 'Syrian Arab Republic',
                            IOScode: 'SY'
                        },
                        {
                            idcountry: '212',
                            countryName: 'Taiwan, Province of China',
                            IOScode: 'TW'
                        },
                        {
                            idcountry: '213',
                            countryName: 'Tajikistan',
                            IOScode: 'TJ'
                        },
                        {
                            idcountry: '214',
                            countryName: 'Tanzania, United Republic of',
                            IOScode: 'TZ'
                        },
                        {
                            idcountry: '215',
                            countryName: 'Thailand',
                            IOScode: 'TH'
                        },
                        {
                            idcountry: '216',
                            countryName: 'Timor-Leste',
                            IOScode: 'TL'
                        },
                        {
                            idcountry: '217',
                            countryName: 'Togo',
                            IOScode: 'TG'
                        },
                        {
                            idcountry: '218',
                            countryName: 'Tokelau',
                            IOScode: 'TK'
                        },
                        {
                            idcountry: '219',
                            countryName: 'Tonga',
                            IOScode: 'TO'
                        },
                        {
                            idcountry: '220',
                            countryName: 'Trinidad and Tobago',
                            IOScode: 'TT'
                        },
                        {
                            idcountry: '221',
                            countryName: 'Tunisia',
                            IOScode: 'TN'
                        },
                        {
                            idcountry: '222',
                            countryName: 'Turkey',
                            IOScode: 'TR'
                        },
                        {
                            idcountry: '223',
                            countryName: 'Turkmenistan',
                            IOScode: 'TM'
                        },
                        {
                            idcountry: '224',
                            countryName: 'Turks and Caicos Islands',
                            IOScode: 'TC'
                        },
                        {
                            idcountry: '225',
                            countryName: 'Tuvalu',
                            IOScode: 'TV'
                        },
                        {
                            idcountry: '226',
                            countryName: 'Uganda',
                            IOScode: 'UG'
                        },
                        {
                            idcountry: '227',
                            countryName: 'Ukraine',
                            IOScode: 'UA'
                        },
                        {
                            idcountry: '228',
                            countryName: 'United Arab Emirates',
                            IOScode: 'AE'
                        },
                        {
                            idcountry: '229',
                            countryName: 'United Kingdom',
                            IOScode: 'GB'
                        },
                        {
                            idcountry: '230',
                            countryName: 'United States',
                            IOScode: 'US'
                        },
                        {
                            idcountry: '231',
                            countryName: 'United States Minor Outlying Islands',
                            IOScode: 'UM'
                        },
                        {
                            idcountry: '232',
                            countryName: 'Uruguay',
                            IOScode: 'UY'
                        },
                        {
                            idcountry: '233',
                            countryName: 'Uzbekistan',
                            IOScode: 'UZ'
                        },
                        {
                            idcountry: '234',
                            countryName: 'Vanuatu',
                            IOScode: 'VU'
                        },
                        {
                            idcountry: '235',
                            countryName: 'Venezuela',
                            IOScode: 'VE'
                        },
                        {
                            idcountry: '236',
                            countryName: 'Viet Nam',
                            IOScode: 'VN'
                        },
                        {
                            idcountry: '237',
                            countryName: 'Virgin Islands, British',
                            IOScode: 'VG'
                        },
                        {
                            idcountry: '238',
                            countryName: 'Virgin Islands, U.S.',
                            IOScode: 'VI'
                        },
                        {
                            idcountry: '239',
                            countryName: 'Wallis and Futuna',
                            IOScode: 'WF'
                        },
                        {
                            idcountry: '240',
                            countryName: 'Western Sahara',
                            IOScode: 'EH'
                        },
                        {
                            idcountry: '241',
                            countryName: 'Yemen',
                            IOScode: 'YE'
                        },
                        {
                            idcountry: '242',
                            countryName: 'Zambia',
                            IOScode: 'ZM'
                        },
                        {
                            idcountry: '243',
                            countryName: 'Zimbabwe',
                            IOScode: 'ZW'
                        }
                    ]).then(() => {

                        if (!result.picture) {
                            urlimg = "";
                        } else {
                            if (fs.existsSync(path.join(appRoot, 'public', 'themes/img/profile/' + result.picture))) {
                                urlimg = result.picture;
                            } else {
                                urlimg = "";
                            }
                        }
                        res.render("./dashboard/editprofile", {
                            title: "Editprofile",
                            firstname: result.firstname,
                            lastname: result.lastname,
                            username: result.username,
                            email: result.email,
                            address: result.address,
                            country: data.countryName,
                            valuecountry: result.country,
                            zipcode: result.zipcode,
                            picture: urlimg,
                            appuse: ""
                        });
                    })

                } else {
                    console.log("data country is ready !");
                    console.log(result.picture);
                    if (!result.picture) {
                        urlimg = "";
                    } else {
                        if (fs.existsSync(path.join(appRoot, 'public', 'themes/img/profile/' + result.picture))) {
                            urlimg = result.picture;
                        } else {
                            urlimg = "";
                        }

                    }
                    res.render("./dashboard/editprofile", {
                        title: "Editprofile",
                        firstname: result.firstname,
                        lastname: result.lastname,
                        username: result.username,
                        email: result.email,
                        address: result.address,
                        country: data.countryName,
                        valuecountry: result.country,
                        zipcode: result.zipcode,
                        picture: urlimg,
                        appuse: ""
                    });
                }
            })

        })
    } catch (error) {
        console.log(error);
        if (devMode == true)
            return res.send({
                status: "3",
                message: error + ''
            });
        else
            return res.json({
                status: "3",
                message: 'Oops, something went wrong'
            });
    }
})

router.post('/changeprofile', uploading.single('avartar'), function (req, res) {
    try {
        User.findOne({
            id: req.session.iduser
        }, (err, result) => {
            if (!result.picture) {
                User.update({
                    id: req.session.iduser
                }, {
                    picture: req.file.filename
                }, (err, result) => {
                    console.log(req.file);
                    var urlimg = req.file.filename;
                    res.send(urlimg);
                });
            } else {
                if (fs.existsSync(path.join(appRoot, 'public', 'themes/img/profile/' + result.picture)))
                    fs.unlinkSync(path.join(appRoot, 'public', 'themes/img/profile/' + result.picture));
                User.update({
                    id: req.session.iduser
                }, {
                    picture: req.file.filename
                }, (err, result) => {
                    console.log(req.file);
                    var urlimg = req.file.filename;
                    res.send(urlimg);
                });
            }
        })
    } catch (error) {
        console.log(error);
        if (devMode == true)
            return res.send({
                status: "3",
                message: error + ''
            });
        else
            return res.json({
                status: "3",
                message: 'Oops, something went wrong'
            });
    }
});
router.post('/editprofile/ok', (req, res) => {
    try {
        // console.log(req.body.username);
        var query = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            address: req.body.address,
            country: req.body.country,
            zipcode: req.body.zipcode,
        }
        User.findOne({
            id: req.session.iduser
        }, (err, data) => {
            if (err) {
                console.log(err);
                return res.json({
                    status: "3",
                    message: err + ''
                });
            }
            if (!data.email) {
                User.update({
                    id: req.session.iduser
                }, query, function (err, result) {
                    if (err) {
                        console.log(err);
                        return res.json({
                            status: "3",
                            message: err + ''
                        });
                    }
                    return res.json({
                        status: "1",
                        message: "success"
                    });

                })
            } else {
                if (data.email == req.body.email) {
                    User.update({
                        id: req.session.iduser
                    }, query).then(() => {
                        User.findOne({
                            id: req.session.iduser
                        }, (err, result) => {
                            Country.findOne({
                                idcountry: result.country
                            }, (err, datacountry) => {
                                return res.json({
                                    status: "1",
                                    message: "success",
                                    user: result,
                                    country: datacountry.country
                                });
                            })
                        })
                    })
                } else {
                    User.findOne({
                        email: req.body.email
                    }, (err, data) => {
                        if (err) {
                            console.log(err);
                            return res.json({
                                status: "3",
                                message: err + ''
                            });
                        }
                        if (!data) {
                            User.update({
                                id: req.session.iduser
                            }, query).then(() => {
                                User.findOne({
                                    id: req.session.iduser
                                }, (err, result) => {
                                    Country.findOne({
                                        idcountry: result.country
                                    }, (err, datacountry) => {
                                        return res.json({
                                            status: "1",
                                            message: "success",
                                            user: result,
                                            country: datacountry.country
                                        });
                                    })
                                })

                            })
                        } else {
                            return res.json({
                                status: "2",
                                message: "Email already exists"
                            });
                        }
                    })
                }
            }
        })

    } catch (error) {
        console.log(error);
        if (devMode == true)
            return res.json({
                status: "3",
                message: error + ''
            });
        else
            return res.json({
                status: "3",
                message: 'Oops, something went wrong'
            });

    }
});
router.post('/changepassword/ok', (req, res) => {
    try {
        // console.log(req.body.username);
        var query = {
            password: md5(req.body.password)
        }
        User.findOne({
            id: req.session.iduser
        }, (err, data) => {
            if (err) {
                console.log(err);
                return res.json({
                    status: "3",
                    message: err + ''
                });
            }
            if (data.password == md5(req.body.oldpass)) {
                User.update({
                    id: req.session.iduser
                }, query, function (err, result) {
                    if (err) {
                        console.log(err);
                        return res.json({
                            status: "3",
                            message: err + ''
                        });
                    }
                    return res.json({
                        status: "1",
                        message: "success"
                    });
                })
            } else {
                return res.json({
                    status: "2",
                    message: "Incorrect password"
                });
            }
        })

    } catch (error) {
        console.log(error);
        if (devMode == true)
            return res.json({
                status: "3",
                message: error + ''
            });
        else
            return res.json({
                status: "3",
                message: 'Oops, something went wrong'
            });

    }
});

module.exports = router;