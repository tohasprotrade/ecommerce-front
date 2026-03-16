export const DisplayPriceInRupees = (price)=>{
    return new Intl.NumberFormat('en-BD',{
        style : 'currency',
        currency : 'BDT'
    }).format(price).replace('BDT', 'tk')
}
