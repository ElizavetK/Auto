import { fetchData } from "./fetchData.js";

const form = document.querySelector('.form');
//const formFieldsets = document.querySelectorAll('.form__fieldset');
const formBtnPrev = document.querySelector('.form__btn_prev');
const formBtnNext = document.querySelector('.form__btn_next');
const formBtnSubmit = document.querySelector('.form__btn_submit');
const formTime = document.querySelector('.form__time');
const formFieldsetClient = document.querySelector('.form__fieldset_client');
const formFieldsetDate = document.querySelector('.form__fieldset_date');
const formFieldsetType = document.querySelector('.form__fieldset_type');
const formFieldsets = [formFieldsetType, formFieldsetDate, formFieldsetClient];
const typeRadioWrapper = document.querySelector('.form__radio-wrapper_type');
const dayRadioWrapper = document.querySelector('.form__radio-wrapper_day');
const timeRadioWrapper = document.querySelector('.form__radio-wrapper_time');
const formMonths = document.querySelector('.form__months');
const formInfoType = document.querySelector('.form__info--type');
const formInfoData = document.querySelector('.form__info-data');

const currentMonth = new Intl.DateTimeFormat('en',{month: 'long'}).format(new Date(),
);
let month = currentMonth;
let currentStep = 0;

const data = await fetchData();
const dataToWrite = {
    dataType: {},
    day: '',
    time: ''
};

console.log('Current month:', month);

const createRadioBtns = (wrapper, name, data)=>{
    wrapper.textContent = '';
    data.forEach(item =>{
        const radioDiv = document.createElement('div');
        radioDiv.className = 'radio';
        const radioInput = document.createElement('input');
        radioInput.className = 'radio__input';
        radioInput.type = 'radio';
        radioInput.name = name
        radioInput.id = item.value
        radioInput.value = item.value
        const radioLabel = document.createElement('label')
        radioLabel.className = 'radio__label';
        radioLabel.htmlFor = item.value;
        radioLabel.textContent = item.title;

        radioDiv.append(radioInput, radioLabel);
        wrapper.append(radioDiv)
    })
}

const allMonth = ['january', 'february', 'march', 'april', 'may', 'june', 'jule', 'august', 'september', 'october', 'november','december']

/* 
<p class="form__info form__info--type">Diagnostik und&nbsp;Motorreparatur</p>
                        <p class="form__info">
                            <time class="form__info-data" datetime="2024-03-02T14:00">
                                <span class="form__info-data-day">3.02</span>
                                <span class="form__info-data-time">14:00</span>
                            </time>
                        </p>
*/

const showResultData = () =>{
    const currentYear = new Date().getFullYear();
    const monthIndex = allMonth.findIndex(item => item === month);
    const dayString = `${currentYear}-${(monthIndex + 1).toString().padStart(2,'0')}-${dataToWrite.day.toString().padStart(2,'0')}T${dataToWrite.time}`;
    
    const dateObj = new Date(dayString);
    const formattedDate = dateObj.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit'
    })

    formInfoType.textContent = dataToWrite.dataType.title;
    formInfoData.innerHTML = `
    <span class="form__info-data-day">${formattedDate}</span>
    <span class="form__info-data-time">${dataToWrite.time}</span>
    `
    formInfoData.datetime = dayString;
}

const updateFieldset = () => {
    for (let i=0; i < formFieldsets.length; i++) {
        if(i===currentStep){
            formFieldsets[i].classList.add('form__fieldset_active')
        }else{
            formFieldsets[i].classList.remove('form__fieldset_active')
        }
    }

    if(currentStep === 0){
        formBtnPrev.style.display = 'none';
        formBtnNext.style.display = '';
        formBtnSubmit.style.display = 'none';
    }else if(currentStep === formFieldsets.length - 1){
        formBtnPrev.style.display = '';
        formBtnNext.style.display = 'none';
        formBtnSubmit.style.display = '';

        showResultData()
    }else{
        formBtnPrev.style.display = '';
        formBtnNext.style.display = '';
        formBtnSubmit.style.display = 'none';
    }
    
}
const createFormDay = (date) =>{
    const objectMonths = date.find(item => item.month.toLowerCase() === month.toLowerCase());
    //const objectMonths = date.find(item => item.month === month);
    
    const days = Object.keys(objectMonths.day);
    const typeData = days.map(item=>({
        value: item,
        title: item
    }))
    createRadioBtns(dayRadioWrapper, 'day', typeData);
}

const createFormMonth = (months) =>{
    formMonths.textContent = '';
    const currentMonthIndex = months.indexOf(month.toLowerCase());
    const visibleMonths = months.slice(currentMonthIndex);

    const btnsMonths = visibleMonths.map(item =>{
        const btn = document.createElement('button');
        
        btn.className = 'form__btn--month';
        btn.type = 'button';

        const currentYear = new Date().getFullYear();
        const formattedMonth = new Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(currentYear, months.indexOf(item), 1));
        btn.textContent = formattedMonth;
        //btn.textContent = `${item[0].toUpperCase()}${item.substring(1).toLowerCase()}`;

        if(item === month){
            btn.classList.add('form__btn--month_active')

        }
        return btn;

        
    });
    formMonths.append(...btnsMonths);
    

    btnsMonths.forEach(btn =>{
        btn.addEventListener('click', ({target})=>{
            if(target.classList.contains('form__btn--month_active')){
                return;
            }
            btnsMonths.forEach(btn => {
                btn.classList.remove('form__btn--month_active');
            });

            target.classList.add('form__btn--month_active');
            month = target.textContent.toLowerCase();

            const date = data.find(item=>item.type === dataToWrite.dataType.type).date;
            createFormDay(date);
        })
    })
}

const createFormTime = (date, day) =>{
    const objectMonths = date.find(item => item.month.toLowerCase() === month.toLowerCase());
    //const objectMonths = date.find(item=>item.month === month);
    const days = objectMonths.day;
    const daysData = days[day].map(item=>({
        value:`${item}:00`,
        title:`${item}:00`
    }))
    createRadioBtns(timeRadioWrapper, 'time', daysData);
    formTime.style.display = 'block';
}
const handleInputForm = ({ currentTarget, target }) =>{
    if (currentTarget.type.value && currentStep === 0){
        formBtnNext.disabled = false;

        const typeObj = data.find(item => item.type === currentTarget.type.value);

        dataToWrite.dataType.type = typeObj.type;
        dataToWrite.dataType.title = typeObj.title;

        const date = typeObj.date;
        const months = date.map(item => item.month)
        createFormMonth(months);
        //createFormDay(date);
    }

    if (currentStep === 1){
        if(currentTarget.day.value && target.name === 'day'){
            dataToWrite.day = currentTarget.day.value;
            const date = data.find(item=> item.type === dataToWrite.dataType.type).date;
            createFormTime(date, dataToWrite.day)
        }
        if(currentTarget.time.value && target.name === 'time'){
            dataToWrite.time = currentTarget.time.value;
            formBtnNext.disabled = false;
        }else{
            formBtnNext.disabled = true;
        }
    }

    if(currentStep === 2){
        const inputs = formFieldsetClient.querySelectorAll('.form__input');
        let allFilled = true;
        inputs.forEach(input =>{
            if (input.value.trim() === ''){
                allFilled = false;
            }
        });

        formBtnSubmit.disabled = !allFilled;
    }
}
const renderTypeFieldset = () =>{
    const typeData = data.map(item=>({
        value:item.type,
        title:item.title
    }))
    createRadioBtns(typeRadioWrapper, 'type', typeData)
}
const init = () => {
    formBtnNext.disabled = true;
    formBtnSubmit.disabled = true;

    formBtnNext.addEventListener('click',()=>{
        if (currentStep < formFieldsets.length - 1){
            currentStep += 1;
            updateFieldset();
            formBtnNext.disabled = true;
            formBtnSubmit.disabled = true;
        }
    })
    
    formBtnPrev.addEventListener('click',()=>{
        if (currentStep > 0){
            currentStep -= 1;
            updateFieldset();
            formBtnNext.disabled = false;
        }
    })
    
    form.addEventListener('input', handleInputForm)
    

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const formDataObj = Object.fromEntries(formData);
        formDataObj.month = month;

        try{
            const response = await fetch('https://animated-descriptive-rooster.glitch.me/api/orders',{
                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formDataObj)
            });
            if (response.ok){
                console.log('Success:', data);
                //alert('Request has been successfully sending');
                form.innerHTML = `<h2>Request has been successfully sending</h2>`
            } else{
                throw new Error(`Error in sending: ${response.status}`)
            }
            
        }
        catch (error){
            console.error(`Error in request: ${error}`)
        }
    })

    updateFieldset();

    renderTypeFieldset()
}

init()