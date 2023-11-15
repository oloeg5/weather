import React, { Component } from "react";
import Card from "../Card/Card";
import Info from "../Info/Info";
import Form from "../Form/Form";
import { typeOfFor } from "../CheckBoxRadio/CheckBoxRadio";

const API_KEY = "8a4b4a7f513618cc3878bed593b60547";

let lat;
let lon;

class Weather extends Component {
  // state это массив с данными, а не отдельные переменные
  state = {
    days: [],
  };

// функция для получения прогноза по названию города и нажатию кнопки
  gettingWeather = async (e) => {

    // отменяем стандартное поведение инпута, 
    // чтобы название города не стиралось после направления запроса
    e.preventDefault();

    // содержимое инпута передаем в переменную
    var city = e.target.elements.city.value;
    let cityFromRequest;
    // ссылка для получения прогноза текущей погоды
    const weatherCurrentURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&lang=ru&units=metric`

    // ссылка для получения прогноза на 5 дней
    const weather5DaysURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&lang=ru&units=metric&APPID=${API_KEY}`;

    // делаем проверку, если хоть что-то написано и 
    // выбран чекбокс "текущая погода", то 
    if (city && typeOfFor === "current") {
      // отправляем запрос для получения текущей погоды
      fetch(weatherCurrentURL)
        .then((res) => res.json())
        .then((data) => {
          // консолим то что пришло с сайта
          console.log(data);
          
          // если код ответа 200, то формируем массив с данными
          if(data.cod == 200){
            // создаем пустой массив
            const dailyData = [];
            // запушить в созданный массив полученный объект
            dailyData.push(data) 
            
            cityFromRequest = data.name;
            // устанавливаем в значение стейта
            // вот этот массив с отфильтрованными данными 
            this.setState({ days: dailyData });              
          } else {
            // если город указан некорретно,то
            // просим ввести название
            this.setState({days:[]})
            alert('Введите название города')
          }
        });
    } 

    // делаем проверку, если хоть что-то написано и 
    // выбран чекбокс "погода на 5 дней", то 
    if (city && typeOfFor === "fiveDays") {
      // отправляем запрос
      fetch(weather5DaysURL)
        .then((res) => res.json())
        .then((data) => {
          // консолим то что пришло с сайта
          console.log(data);

          // если код ответа 200, то формируем массив с данными
          if(data.cod == 200){
              // отбираем только значения на 12.00 часов
              // складываем их в массив (5 значений = 5 дней)
              const dailyData = data.list.filter((reading) =>
              reading.dt_txt.includes("12:00:00")
              );
              cityFromRequest = data.city.name;
              // устанавливаем в значение стейта
              // вот этот массив с отфильтрованными данными 
              this.setState({ days: dailyData }); 
          } else {
            // если город указан некорретно,то
            // просим ввести название
            this.setState({days:[]})
            alert('Введите название города')
          }          
        });        
    }     
  };

  // функция для получения прогноза по текущим координатам

  getWeaByCoords = async () => {
    const success = await function (position) {
      // получаем текущие координаты пользователя
      lat = position.coords.latitude;
      lon = position.coords.longitude;
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success);
    }
    // ссылка для получения прогноза текущей погоды по координатам
    const weatherCurrentCoordsURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&lang=ru&units=metric`

    // ссылка для получения прогноза погоды на 5 дней по координатам
    const weather5DaysCoordsURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&lang=ru&units=metric`

    if (typeOfFor === "current") {
      fetch(weatherCurrentCoordsURL)
        .then((res) => res.json())
        .then((data) => {
          // консолим то что пришло с сайта
          console.log(data);
          
          // если код ответа 200, то формируем массив с данными
          if(data.cod == 200){
            // создаем пустой массив
            const dailyData = [];
            // запушить в созданный массив полученный объект
            dailyData.push(data) 
            
            // устанавливаем в значение стейта
            // вот этот массив с отфильтрованными данными 
            this.setState({ days: dailyData });              
          } else {
            this.setState({days:[]})
            alert("Что-то не так, поменяйте тип погоды и попробуйте снова")
          }
        });
    }

    if(typeOfFor === "fiveDays") {
       fetch(weather5DaysCoordsURL)
        .then((res) => res.json())
        .then((data) => {
          // консолим то что пришло с сайта
          console.log(data);

          // если код ответа 200, то формируем массив с данными
          if(data.cod == 200){
              // отбираем только значения на 12.00 часов
              // складываем их в массив (5 значений = 5 дней)
              const dailyData = data.list.filter((reading) =>
              reading.dt_txt.includes("12:00:00")
              );
              // устанавливаем в значение стейта
              // вот этот массив с отфильтрованными данными 
              this.setState({ days: dailyData }); 
          } else {
            this.setState({days:[]})
            alert("Что-то не так, поменяйте тип погоды и попробуйте снова")

          }          
        }); 
    }
  }
    // здесь вывод карточек по количеству инфы в массиве
    // и передача пропсов в компонент Card
    formatCards = () => {
      return this.state.days.map((day) => <Card day={day} />);
    };

  render() {
    return (
      <div>
        <Info city={this.state.days.name}/>
        <Form 
        gettingWeather={this.gettingWeather} 
        getWeaByCoords={this.getWeaByCoords}/>
        <div>{this.formatCards()}</div>
      </div>
    );
  }
}

export default Weather;
