export const fetchData = async () =>{
    try{
        const response = await fetch('https://animated-descriptive-rooster.glitch.me/api');
        if(!response.ok){
            throw new Error(`HTTP error, status: ${response.status}`);
        }
        return await response.json();
        }
    catch{
        console.error(`Error in receiving of date ${error}`);
    }
}