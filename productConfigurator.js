import { LightningElement, track, wire, api } from 'lwc';
import { refreshApex } from "@salesforce/apex";
import { FlowAttributeChangeEvent, FlowNavigationNextEvent } from 'lightning/flowSupport';
import getPriceBookEntries from '@salesforce/apex/QueryProductsForProductConfig.getPriceBookEntries';
import LightningAlert from 'lightning/alert';

const columns = [
{label: 'Product Name', fieldName: 'Product_Name__c', type: 'text', sortable: true, displayReadOnlyIcon: true, iconName: 'utility:product'},
{label: 'Product Code', fieldName: 'ProductCode', displayReadOnlyIcon: true, iconName: 'utility:coupon_codes'},
{label: 'Product Family', fieldName: 'Product_Family__c', displayReadOnlyIcon: true, iconName: 'utility:buyer_group_qualifier'},
{label: 'Ecosystem', fieldName: 'Ecosystem__c', displayReadOnlyIcon: true, iconName: 'utility:world'},
{label: 'List Price', fieldName: 'UnitPrice', type: 'currency', displayReadOnlyIcon: true, iconName: 'utility:currency',
    typeAttributes: { maximumFractionDigits: '2', currencyCode: 'USD' },
    cellAttributes: { alignment: 'left' }},
]

const productCodesFedRamp = [
    'FRSFDCRECUNL',
    'FRSFDCRECHF12H',
    'FRSFDCRECHF8H',
    'FRSFDCRECHF6H',
    'FRSFDCRECHF4H',   
    'FRSFDCRECHF3H',
    'FRSFDCRECHF2H',
    'FRSFDCRECHF1H',
    'FRSFDCRECHF15MIN',    
    'FRSFDCARCH',
    'OBESBSFR',
    'FRMSFTRECUNL',
    'FRNOWUNLFUL',
    'FRNOWUNLRSUBU3KMAX',
    'FRNOWUNLRSUBU6KMAX',
    'FRNOWUNLRSUBU75KMAX',
    'FRNOWUNLRSUBU10KMAX',
    'FRNOWUNLRSUBU25KMAX',
    'FRNOWUNLRSUBU150KMAX',
    'FRNOWUNLRSUBU250KMAX',
    'FROBPREM',
    'FROBPREMPLUS',
    'FRSFDCUNLCOMM',
    'FRSFDCUNLCUSTLOGINS',
    'FRSFDCUNLCUSTLOGINS1k',
    'FRSFDCUNLCUSTMEM',
    'FRSFDCUNLCUSTMEM+',
    'FRSFDCUNLCUSTLOGINS+',
    'FRSFDCUNLPARTLOGINS',
    'FRSFDCUNLCUSTLOGINS+1k',
    'FRSFDCUNLPARTLOGINS1k',
    'FRSFDCUNLPARTMEM',
    'FRTAMUNL',
    'FRSETUP',
]

const productCodesTAM = [
'FRTAMUNL',
'TAMAKM',
'TAMARC',
'TAMENT',
'TAMENTAKM',
'TAMENTARC',
'TAMUNL',
'TAMUNLAKM',
'TAMUNLARC',
'TAMUNLARCAKM',
'TAM10PUPM',
'TAM15PUPM',
'TAM20PUPM',
'TAMGOV',
'TAMENTESBSAKM',
'TAMENTESBSAKMARC',
'TAMGOVESBSARC',
'TAMUNLESBSAKMARC',
'TAMENTESBS',
'TAMGOVESBS',
'TAMENTESBSARC',
'TAMESBS',
'TAMUNLESBSAKM',
'TAMUNLESBS',
'TAMUNLESBSARC',
'TAMMIN',
'TAM35PUPM',
'TAM50PUPM',
]

const productCodesCSP = [
    'CSPPAKM',
    'CSPPARC',
    'CSPPENT',
    'CSPPENTAKM',
    'CSPPENTARC',
    'CSPPUNL',
    'CSPPUNLAKM',
    'CSPPUNLARC',
    'CSPPUNLARCAKM',
    'CSPP10PUPM',
    'CSPP15PUPM',
    'CSPP20PUPM',
    'CSPPGOV',
    'CSPP35PUPM',
    'CSPPENTESBS',
    'CSPPUNLESBSAKMARC',
    'CSPPESBS',
    'CSPPESBSAKM',
    'CSPPESBSAKMARC',
    'CSPPUNLESBSARC',
    'CSPPENTESBSARC',
    'CSPPGOVESBS',
    'CSPPGOVESBSARC',
    'CSPPUNLESBS',
    'CSPPUNLESBSAKM',
    'CSPPMIN',
    'CSPP50PUPM',

]

const productCodesCSSP = [
    'CSP3AKM',
    'CSP3ARC',
    'CSP3ENT',
    'CSP3ENTAKM',
    'CSP3ENTARC',
    'CSP3UNL',
    'CSP3UNLAKM',
    'CSP3UNLARC',
    'CSP3UNLARCAKM',
    'CSP310PUPM',
    'CSP315PUPM',
    'CSP320PUPM',
    'CSP3GOV',
    'CSP3ESBS',
    'CSP3ENTESBS',
    'CSP3ENTESBSARC',
    'CSP3GOVESBS',
    'CSP3UNLESBS',
    'CSP3GOVESBSARC',
    'CSP3ESBSAKM',
    'CSP3ESBSAKMARC',
    'CSP3UNLESBSAKM',
    'CSP3UNLESBSAKMARC',
    'CSP3UNLESBSARC',
    'CSP3MIN',
    'CSP350PUPM',
    'CSP335PUPM', 
]

const productCodesAPS = [
    'SETUP',
    'PREM-ARCH-SERV',
    'FRSETUP',
]

const productCodesSOP = [
    'SECWKSP',
    'SECPLTENC',
    'SETUPSECPRGSM',
    'SETUPSECPRGLG',
    'SETUPSECPRGMED',
    'SETUPSECURE2',
]

const productCodesBackupUnlimited = [
    'SFDCUNL22',
    'MSDYUNL22',
    'SVCNOWUNLFUL',
    'NOW-UNL-BR-30K',  
    'NOW-UNL-BR-1.5K',
    'NOW-UNL-BR-2.5K',
    'NOW-UNL-BR-5K',
    'NOW-UNL-BR-15K',
    'NOW-UNL-BR-55K',
    'NOW-UNL-BR-105K',
    'NOW-UNL-BR-1M',
    'NOW-UNL-BR-250K',
    'NOW-UNL-BR-500K',
]

const productCodesBackupProfessional = [
    'SFDCPRO',
]

const productCodesBackupEnterprise = [
    'ENTLICENSE',
    'SFDCENT22',
]

const productCodesBackupEssential = [
    'SFDC-ESNT-BR',
]


const productCodesCustCommLogins = [
    'FRSFDCUNLCUSTLOGINS',
    'SFDCSECCUSTLOGINS',
    'SFDCSECSHCUSTLOGINS',
    'SFDCUNLCUSTLOGINS',
]

const productCodesCustCommLoginBundle = [
    'FRSFDCUNLCUSTLOGINS1k',
    'SFDCSECCUSTLOGINS1k',
    'SFDCSECSHCUSTLOGINS1k',
    'SFDCUNLCUSTLOGINS1k',
]

const productCodesCustCommMembers = [
    'FRSFDCUNLCUSTMEM',
    'SFDCSECCUSTMEM',
    'SFDCSECSHCUSTMEM',
    'SFDCUNLCUSTMEM',
]

const productCodesCustCommPlusMembers = [
    'FRSFDCUNLCUSTMEM+',
    'SFDCSECCUSTMEM+',
    'SFDCSECSHCUSTMEM+',
    'SFDCUNLCUSTMEM+',
]

const productCodesCustCommPlusLogin = [
    'FRSFDCUNLCUSTLOGINS+',
    'SFDCSECCUSTLOGINS+',
    'SFDCSECSHCUSTLOGINS+',
    'SFDCUNLCUSTLOGINS+',
]

const productCodesCustCommPlusLoginBundle = [
    'FRSFDCUNLCUSTLOGINS+1k',
    'SFDCSECCUSTLOGINS+1k',
    'SFDCSECSHCUSTLOGINS+1k',
    'SFDCUNLCUSTLOGINS+1k',
]

const productCodesPartnerCommmLogin = [
    'FRSFDCUNLPARTLOGINS',
    'SFDCSECPARTLOGINS',
    'SFDCSECSHPARTLOGINS',
    'SFDCUNLPARTLOGINS',
]

const productCodesPartnerCommLoginBundle = [
    'FRSFDCUNLPARTLOGINS1k',
    'SFDCSECPARTLOGINS1k',
    'SFDCSECSHPARTLOGINS1k',
    'SFDCUNLPARTLOGINS1k',
]

const productCodesPartnerCommMember = [
    'FRSFDCUNLPARTMEM',
    'SFDCSECPARTMEM',
    'SFDCSECSHPARTMEM',
    'SFDCUNLPARTMEM',
]

function filterQuickPickProducts(selectedChoices, products) {
    const allRecords = products;
    const choices = selectedChoices
    let productToReturn = [];

    if(choices.length>0){
        for(let i=0; i<choices.length; i++) {
            for(let n=0; n<allRecords.length; n++)
                if(allRecords[n].ProductCode === choices[i]) {
                    productToReturn.push(allRecords[n]);
                }
            
        }
    }   
    return productToReturn;
}

function filterProductFamily(selectedChoices, products){
    const allRecords = products;
    const choices = selectedChoices
    let productToReturn = [];

    if(choices.length>0){
        for(let i=0; i<choices.length; i++) {
            for(let n=0; n<allRecords.length; n++)
                if(allRecords[n].Product_Family__c === choices[i]) {
                    productToReturn.push(allRecords[n]);
                }
        }
    }
    return productToReturn;
}

function filterCloudEcosystem(selectedChoices, products){
    const allRecords = products;
    const choices = selectedChoices
    let productToReturn = [];

    if(choices.length>0){
        for(let i=0; i<choices.length; i++) {
            for(let n=0; n<allRecords.length; n++)
                if(allRecords[n].Ecosystem__c === choices[i]) {
                    productToReturn.push(allRecords[n]);
                }
        }
    }
    return productToReturn;
}

function filterInstanceType(selectedChoices, products){
    const allRecords = products;
    const choices = selectedChoices
    let productToReturn = [];
    
    if(choices.length>0){
        for(let i=0; i<choices.length; i++) {
            if(choices[i] === 'Standard'){
                for(let z=0; z<allRecords.length; z++){
                    if(!productCodesFedRamp.includes(allRecords[z].ProductCode)){
                        productToReturn.push(allRecords[z]);
                    }
                }
            } else if(choices[i] === 'FedRamp'){
                for(let n=0; n<allRecords.length; n++){
                    if(productCodesFedRamp.includes(allRecords[n].ProductCode)){
                        productToReturn.push(allRecords[n]);
                    }
                }
            }
        }
    }
            return productToReturn;
    }

function filterAdditionalBackupProducts(selectedChoices, products){
    const allRecords = products;
    const choices = selectedChoices
    let productToReturn = [];

    if(choices.length > 0){
        for(let i=0; i<choices.length; i++){
            if(choices[i] === 'unlimited'){
                for(let n=0; n<allRecords.length; n++){
                    if(productCodesBackupUnlimited.includes(allRecords[n].ProductCode)){
                        productToReturn.push(allRecords[n]);
                    }
                }
            } else if(choices[i] === 'professional'){
                for(let z=0; z<allRecords.length; z++){
                    if(productCodesBackupProfessional.includes(allRecords[z].ProductCode)){
                        productToReturn.push(allRecords[z]);
                    }
                }
            } else if(choices[i] === 'enterprise'){
                for(let x=0; x<allRecords.length; x++){
                    if(productCodesBackupEnterprise.includes(allRecords[x].ProductCode)){
                        productToReturn.push(allRecords[x]);
                    }
                }
            } else if(choices[i] === 'essential'){
                for(let v=0; v<allRecords.length; v++){
                    if(productCodesBackupEssential.includes(allRecords[v].ProductCode)){
                        productToReturn.push(allRecords[v]);
                    }
                }
            } else if(choices[i] === 'Cust Comm Login'){
                for(let b=0; b<allRecords.length; b++){
                    if(productCodesCustCommLogins.includes(allRecords[b].ProductCode)){
                        productToReturn.push(allRecords[b]);
                    }
                }
            } else if(choices[i] === 'Cust Comm Login Bundle'){
                for(let p=0; p<allRecords.length; p++){
                    if(productCodesCustCommLoginBundle.includes(allRecords[p].ProductCode)){
                        productToReturn.push(allRecords[p]);
                    }
                }
            } else if(choices[i] === 'Cust Comm Member'){
                for(let t=0; t<allRecords.length; t++){
                    if(productCodesCustCommMembers.includes(allRecords[t].ProductCode)){
                        productToReturn.push(allRecords[t]);
                    }
                }
            } else if(choices[i] === 'Cust Comm Plus Member'){
                for(let r=0; r<allRecords.length; r++){
                    if(productCodesCustCommPlusMembers.includes(allRecords[r].ProductCode)){
                        productToReturn.push(allRecords[r]);
                    }
                }
            } else if(choices[i] === 'Cust Comm Plus Login'){
                for(let q=0; q<allRecords.length; q++){
                    if(productCodesCustCommPlusLogin.includes(allRecords[q].ProductCode)){
                        productToReturn.push(allRecords[q]);
                    }
                }
            } else if(choices[i] === 'Cust Comm Plus Bundle'){
                for(let a=0; a<allRecords.length; a++){
                    if(productCodesCustCommPlusLoginBundle.includes(allRecords[a].ProductCode)){
                        productToReturn.push(allRecords[a]);
                    }
                }
            } else if(choices[i] === 'Partner Comm Login'){
                for(let s=0; s<allRecords.length; s++){
                    if(productCodesPartnerCommmLogin.includes(allRecords[s].ProductCode)){
                        productToReturn.push(allRecords[s]);
                    }
                }
            } else if(choices[i] === 'Partner Comm Login Bundle'){
                for(let f=0; f<allRecords.length; f++){
                    if(productCodesPartnerCommLoginBundle.includes(allRecords[f].ProductCode)){
                        productToReturn.push(allRecords[f]);
                    }
                }
            } else if(choices[i] === 'Partner Comm Member'){
                for(let l=0; l<allRecords.length; l++){
                    if(productCodesPartnerCommMember.includes(allRecords[l].ProductCode)){
                        productToReturn.push(allRecords[l]);
                    }
                }
            }
        }
    }

    return productToReturn;
}

function filterServiceProducts(selectedChoices, products){
    const allRecords = products;
    const choices = selectedChoices
    let productToReturn = [];
    if(choices.length > 0){
        for(let i=0; i<choices.length; i++) {
            if(choices[i] === 'TAM'){
                for(let n=0; n<allRecords.length; n++){
                    if(productCodesTAM.includes(allRecords[n].ProductCode)){
                        console.log('entered TAM loop');
                        productToReturn.push(allRecords[n]);
                    }
                }
            } else if(choices[i] === 'CSP') {
                for(let c=0; c<allRecords.length; c++){
                    if(productCodesCSP.includes(allRecords[c].ProductCode)){
                        console.log('entered CSP loop');
                        productToReturn.push(allRecords[c]);
                    }
                }
            } else if(choices[i] === 'CSPP') {
                for(let z=0; z<allRecords.length; z++){
                    if(productCodesCSSP.includes(allRecords[z].ProductCode)){
                        console.log('entered CSSP loop');
                        productToReturn.push(allRecords[z]);
                    }
                }
            } else if(choices[i] === 'APS') {
                for(let a=0; a<allRecords.length; a++){
                    if(productCodesAPS.includes(allRecords[a].ProductCode)){
                        console.log('entered APS loop');
                        productToReturn.push(allRecords[a]);
                    }
                }
            } else if(choices[i] === 'SOP') {
                for(let s=0; s<allRecords.length; s++){
                    if(productCodesSOP.includes(allRecords[s].ProductCode)){
                        console.log('entered SOP loop');
                        productToReturn.push(allRecords[s]);
                    }
                }
            }
        }
            
    }
    return productToReturn;    
}

    
export default class ProductConfigurator extends LightningElement {
productsAdded;
columns = columns;
productData = [];
originalProductData = [];
selectedProducts = [];
retrievedProductData = [];
showSelectedProducts = 'Selected Products Beta';
countOfSelectedProducts = 0;
@api selectedPriceBookEntries = '';
@api outputSelectedRows = [];
@api isConfirmationModalOpen = false;

@track searchString;
@wire(getPriceBookEntries)
wired_details({ error, data }) {
    if (data) {
        //console.log('data',data);            
        this.productData = data;
        this.retrievedProductData= data;  
        this.originalProductData = data;       
    } else if (error) {
        console.log(error);
        this.error = error;
    }
}

sortDirection = 'asc';
sortedBy;

sortBy(field, reverse, primer) {
    const key = primer
            ? function (x) {
                  return primer(x[field]);
              }
            : function (x) {
                  return x[field];
              };

        return function (a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
}

handleSortData(event){
    const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.productData];

        cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
        this.productData = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
}

handleCancel(event){
    // var url = window.location.href; 
    // var value = url.substr(0,url.lastIndexOf('/') + 1);
    // window.history.back();
    // return false;

    this.isConfirmationModalOpen = true;
}



handleOk() {
    var url = window.location.href; 
    var value = url.substr(0,url.lastIndexOf('/') + 1);
    window.history.back();
    return false;
    // window.history.back();
    // return false;
    
}

handleConfirmationCancel() {
    this.isConfirmationModalOpen = false;
}

handleSave(event){
    console.log('Save Button Pressed');
    console.log('productsAdded: ' +this.productsAdded);
    if(this.productsAdded){
        const navigateNextEvent = new FlowNavigationNextEvent();
        this.dispatchEvent(navigateNextEvent);
    } else {
        console.log('no products added');
        LightningAlert.open({
            message: 'You must add products in order to proceed.',
            theme: 'error',
            label: 'No Products Added',
        })
    }
}

handleSearch(event) {
    console.log('4444444', event);
    const productSearch = event.target.value;
    console.log('productSearch= ' +productSearch);
    const searchString = productSearch.toUpperCase();
    console.log('searchString= ' +searchString);

    const allRecords = this.originalProductData;
    //const allRecords = this.productData;

    console.log(`Size of allRecords: ${allRecords.length}`);
    let searchResult = [];

    for(let i=0; i<allRecords.length; i++){
        //console.log(allRecords[i]);
        if(allRecords[i].Product_Name__c && searchString != '' && (allRecords[i].Product_Name__c.toUpperCase().includes(searchString))) {
            searchResult.push(allRecords[i]);
            console.log(`searchResult length ${searchResult.length}`);
            console.log('match--');
        }
    }

    if(searchResult.length != 0){
        console.log(`searchResult: ${searchResult[0].Product_Name__c}`);
        this.productData = [];
        this.productData = searchResult;
        this.productData = searchResult;
        //console.log('new pricebook entry value: ' +this.PricebookEntry.data[0].Product_Name__c);
        console.log('not blank--');
    } else if(searchResult.length === 0 && searchString != '') {
        this.productData = [];
    } else {
        this.productData = this.retrievedProductData;
    }

}

handleFilterSelections(event) {
    let instanceTypeResults = [];
    let selectedInstanceTypes = [];
    let selectedQuickPicks = [];
    let quickPickResults = [];
    let productFamilyResults = [];
    let selectedProductFamilies = [];
    let cloudEcosystemResults = [];
    let selectedCloudEcosystems = [];
    let serviceProductsResults = [];
    let selectedServiceProducts = [];
    let additionalBackupProductsResults = [];
    let selectedAdditionalBackupProducts = [];
    let filterResults = [];
    const divQuickPick = this.template.querySelector(".Product-Quick-Picks");
    const choicesQuickPicks = divQuickPick.querySelectorAll(".QP-Choices");
    const divProductFamily = this.template.querySelector(".Product-Family-Checkboxes");
    const choicesProductFamily = divProductFamily.querySelectorAll(".PF-Choices");
    const divProductEcosystem = this.template.querySelector(".Product-Ecosystem-Checkboxes");
    const choicesProductEcosystem = divProductEcosystem.querySelectorAll(".PE-Choices");
    const divInstanceType = this.template.querySelector(".Instance-Type-Checkboxes");
    const choicesInstanceType = divInstanceType.querySelectorAll(".Instance-Choices");
    const divServiceOptions = this.template.querySelector(".Serivce-Product-Checkboxes");
    const choicesServiceOptions = divServiceOptions.querySelectorAll(".SO-Choices");
    const divAdditionalBackupProducts = this.template.querySelector(".Additional-Backup-Products-Checkboxes");
    const choicesAdditionalBackupProducts = divAdditionalBackupProducts.querySelectorAll(".ABP-Choices");
    const clearFilterButton = this.template.querySelector(".clear-filters-button");
    //console.log('additional products: ' +divAdditionalBackupProducts.hidden);

/*______________________________________________Quick Pick Section________________________________________________________*/

    for(let i=0; i<choicesQuickPicks.length; i++) {
        if(choicesQuickPicks[i].checked) {
            selectedQuickPicks.push(choicesQuickPicks[i].value);
            //console.log('selected quick picks: ' +selectedQuickPicks);
        }
    }

    if(selectedQuickPicks.length > 0) {
        //console.log('call quick pick function');
        quickPickResults = filterQuickPickProducts(selectedQuickPicks, this.retrievedProductData);
        filterResults = quickPickResults;
    }

/*_________________________________________________________________________________________________________________________*/     

/*______________________________________________Product Family Section_____________________________________________________*/
                        
    
    for(let i=0; i<choicesProductFamily.length; i++){
        if(choicesProductFamily[i].checked){
            console.log('current product family: ' +choicesProductFamily[i].value);
            selectedProductFamilies.push(choicesProductFamily[i].value);
                if(choicesProductFamily[i].value === 'Services'){
                    divServiceOptions.hidden = false;
                } else if(choicesProductFamily[i].value === 'Backup'){
                    divAdditionalBackupProducts.hidden = false;
                }
        } else if(!choicesProductFamily[i].checked && choicesProductFamily[i].value === 'Services'){
            divServiceOptions.hidden = true;
        } else if(!choicesProductFamily[i].checked && choicesProductFamily[i].value === 'Backup'){
            divAdditionalBackupProducts.hidden = true;
        }
    }
    if(selectedProductFamilies.length > 0){
        const newRecordList = quickPickResults.length > 0 ? quickPickResults : this.retrievedProductData
        productFamilyResults = filterProductFamily(selectedProductFamilies, newRecordList);
        console.log('count of products returned: ' +productFamilyResults.length);
        filterResults = productFamilyResults;
    }
/*_________________________________________________________________________________________________________________________*/    

/*______________________________________________Cloud Ecosystem Section____________________________________________________*/

    for(let i=0; i<choicesProductEcosystem.length; i++){
        if(choicesProductEcosystem[i].checked){
            selectedCloudEcosystems.push(choicesProductEcosystem[i].value);
        }
    }

    if(selectedCloudEcosystems.length > 0) {
        let newRecordList = [];
        if(productFamilyResults.length > 0){
            newRecordList = productFamilyResults;
        } else if(quickPickResults.length > 0){
            newRecordList = quickPickResults;
        } else {
            newRecordList = this.retrievedProductData;
        }
        cloudEcosystemResults = filterCloudEcosystem(selectedCloudEcosystems, newRecordList);
        //console.log('count of products returned: ' +cloudEcosystemResults.length);
        filterResults = cloudEcosystemResults;
    }
/*___________________________________________________________________________________________________________________________*/

/*______________________________________________Instance Type Section________________________________________________________*/

    //if instance type checkbox is TRUE, add value to array
    for(let i=0; i<choicesInstanceType.length; i++){
        if(choicesInstanceType[i].checked){
            selectedInstanceTypes.push(choicesInstanceType[i].value);
        }
    }

    if(selectedInstanceTypes.length > 0){
        let newRecordList = [];
        if(cloudEcosystemResults.length > 0){
            newRecordList = cloudEcosystemResults;
        } else if(productFamilyResults.length > 0){
            newRecordList = productFamilyResults;
        } else if(quickPickResults.length > 0){
            newRecordList = quickPickResults;
        } else {
            newRecordList = this.retrievedProductData;
        }
        //console.log('instance type selected');
        instanceTypeResults = filterInstanceType(selectedInstanceTypes, newRecordList);
        filterResults = instanceTypeResults;
    }
/*_________________________________________________________________________________________________________________________*/

/*____________________________________________Service Products Section_____________________________________________________*/

for(let i=0; i<choicesServiceOptions.length; i++){
    if(choicesServiceOptions[i].checked){
        selectedServiceProducts.push(choicesServiceOptions[i].value);
    }
}

if(selectedServiceProducts.length > 0) {
    //console.log('selected service products: ' +selectedServiceProducts);
    let newRecordList = [];

    if(instanceTypeResults.length > 0) {
        newRecordList = instanceTypeResults;
    } else if(cloudEcosystemResults.length > 0) {
        newRecordList = cloudEcosystemResults;
    } else if(productFamilyResults.length > 0) {
        newRecordList = productFamilyResults;
    } else if(quickPickResults.length > 0) {
        newRecordList = quickPickResults;
    } else {
        newRecordList = this.retrievedProductData;
    }

    serviceProductsResults = filterServiceProducts(selectedServiceProducts, newRecordList);
    filterResults = serviceProductsResults;
}
/*_________________________________________________________________________________________________________________________*/

/*____________________________________________Additional Backup Products Section___________________________________________*/

for(let i=0; i<choicesAdditionalBackupProducts.length; i++){
    if(choicesAdditionalBackupProducts[i].checked){
        console.log(choicesAdditionalBackupProducts[i].value);
        selectedAdditionalBackupProducts.push(choicesAdditionalBackupProducts[i].value);
    }
}

if(selectedAdditionalBackupProducts.length > 0){
    let newRecordList = [];

    if(serviceProductsResults.length > 0){
        newRecordList = serviceProductsResults;
    } else if(instanceTypeResults.length > 0){
        newRecordList = instanceTypeResults;
    } else if(cloudEcosystemResults.length > 0){
        newRecordList = cloudEcosystemResults;
    } else if(productFamilyResults.length > 0){
        newRecordList = productFamilyResults;
    } else if(quickPickResults.length > 0){
        newRecordList = quickPickResults;
    } else {
        newRecordList = this.retrievedProductData;
    }

    additionalBackupProductsResults = filterAdditionalBackupProducts(selectedAdditionalBackupProducts, newRecordList);
    filterResults = additionalBackupProductsResults;
}
/*_________________________________________________________________________________________________________________________*/

    if(filterResults.length > 0) {
        clearFilterButton.hidden = false;
        this.productData = [];
        this.productData = filterResults;
        this.productData = filterResults;
    } else {
        this.productData = this.retrievedProductData;
    }
    
}

handleClearFilters(event){
    const divProductFamily = this.template.querySelector(".Product-Family-Checkboxes");
    const choicesProductFamily = divProductFamily.querySelectorAll(".PF-Choices");
    const divProductEcosystem = this.template.querySelector(".Product-Ecosystem-Checkboxes");
    const choicesProductEcosystem = divProductEcosystem.querySelectorAll(".PE-Choices");
    const divInstanceType = this.template.querySelector(".Instance-Type-Checkboxes");
    const choicesInstanceType = divInstanceType.querySelectorAll(".Instance-Choices");
    const divQuickPick = this.template.querySelector(".Product-Quick-Picks");
    const choicesQuickPicks = divQuickPick.querySelectorAll(".QP-Choices");
    const divServiceOptions = this.template.querySelector(".Serivce-Product-Checkboxes");
    const choicesServiceOptions = divServiceOptions.querySelectorAll(".SO-Choices");
    const divAdditionalBackupProducts = this.template.querySelector(".Additional-Backup-Products-Checkboxes");
    const choicesAdditionalBackupProducts = divAdditionalBackupProducts.querySelectorAll(".ABP-Choices");

    divServiceOptions.hidden = true; //hide the service products field
    divAdditionalBackupProducts.hidden = true //hide the additional backup products field 
    
    //clear the product family checkboxes
    for(let i=0; i<choicesProductFamily.length; i++){
        if(choicesProductFamily[i].checked){
            // console.log(choicesProductFamily[i].checked, choicesProductFamily[i].type);
            choicesProductFamily[i].checked = false;
        }
    }

    //clear the ecosystem checkboxes
    for(let i=0; i<choicesProductEcosystem.length; i++){
        if(choicesProductEcosystem[i].checked){
            // console.log(choicesProductEcosystem[i].checked, choicesProductEcosystem[i].type);
            choicesProductEcosystem[i].checked = false;
        }
    }

    //clear the instance type checkboxes
    for(let i=0; i<choicesInstanceType.length; i++){
        if(choicesInstanceType[i].checked){
            // console.log(choicesInstanceType[i].checked, choicesInstanceType[i].type);
            choicesInstanceType[i].checked = false;
        }
    }

    //clear the quick pick checkboxes
    for(let i=0; i<choicesQuickPicks.length; i++){
        if(choicesQuickPicks[i].checked){
            choicesQuickPicks[i].checked = false;
        }
    }

    //clear the service products checkboxes
    for(let i=0; i<choicesServiceOptions.length; i++){
        if(choicesServiceOptions[i].checked){
            choicesServiceOptions[i].checked = false;
        }
    }

    //clear the additional backup products checkboxes
    for(let i=0; i<choicesAdditionalBackupProducts.length; i++){
        if(choicesAdditionalBackupProducts[i].checked){
            choicesAdditionalBackupProducts[i].checked = false;
        }
    }

    this.productData = this.retrievedProductData;
    event.target.hidden = true;


    }

    handleRowSelection(evt){
    console.log('row selected');
    // List of selected items from the data table event.
    let updatedItemsSet = new Set();
    // List of selected items we maintain.
    let selectedItemsSet = new Set(this.selection);
    // List of items currently loaded for the current view.
    let loadedItemsSet = new Set();


    this.productData.map((event) => {
        loadedItemsSet.add(event.Id);
        //console.log(event.Id);
    });

    switch (evt.detail.config.action) {
        case 'selectAllRows':
            for (let i = 0; i < evt.detail.selectedRows.length; i++) {
                this.outputSelectedRows.push(evt.detail.selectedRows[i]);
                // currentlySelectedData.push(evt.detail.selectedRows[i]);
            }
            break;
        case 'deselectAllRows':
            this.outputSelectedRows = [];
            break;
        case 'rowSelect':
            this.outputSelectedRows.push(evt.detail.config.value);
            break;
        case 'rowDeselect':
            const index = this.outputSelectedRows.indexOf(evt.detail.config.value);
            if (index !== -1) {
                this.outputSelectedRows.splice(index, 1);
            }
            break;
        default:
            break;
    }

    if (evt.detail.selectedRows) {
        evt.detail.selectedRows.map((event) => {
            updatedItemsSet.add(event.Id);
            
                });


        // Add any new items to the selection list
        updatedItemsSet.forEach((id) => {
            if (!selectedItemsSet.has(id)) {
                selectedItemsSet.add(id);
            }
        });        
    }


    loadedItemsSet.forEach((id) => {
        if (selectedItemsSet.has(id) && !updatedItemsSet.has(id)) {
            // Remove any items that were unselected.
            selectedItemsSet.delete(id);
        }
    });


    this.selection = [...selectedItemsSet];
    console.log('---selection---'+JSON.stringify(this.selection));
    this.selectedProducts = Array.from(this.selection);
    console.log('line 357: '+this.selectedProducts);
    let selectedPriceBookIds = JSON.stringify(this.selection);
    if(selectedPriceBookIds.length > 0){
        console.log('this.productsAdded: '+this.productsAdded);
        this.productsAdded = true;
    } else {
        console.log('this.productsAdded: '+this.productsAdded);
        this.productsAdded = false;
    }
    
    console.log(selectedPriceBookIds);

        this.countOfSelectedProducts = this.outputSelectedRows.length;
        this.dispatchEvent(new FlowAttributeChangeEvent('selectedPriceBookEntries', selectedPriceBookIds));
    }

    handleShowSelected(event){
        console.log('show selected products');
        console.log(this.outputSelectedRows);
        this.productData = [];
        this.selectedProducts = [];

        if(this.outputSelectedRows.length > 0){
            for(let i=0; i<this.outputSelectedRows.length; i++){
                this.productData.push(this.outputSelectedRows[i]);
            }
        }

        this.selectedProducts = this.productData;
        
    }
}
