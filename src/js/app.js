'use strict';
import noUiSlider from 'nouislider';
import { consoleInfo } from './modules/console-info.js';

// > - - - - - - - - [app development] - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
document.addEventListener('DOMContentLoaded', app);
function app() {
   consoleInfo();
   // - - - - - - - [products filter] - - - - - - - - - - - - - - - - - - - - - - - - - - - -
   const productContainer = document.querySelector('.products__items');
   const products = [...productContainer.querySelectorAll('.item-products')];
   const rangeSlider = document.getElementById('range-slider');
   const rang1 = document.querySelector('.filter__input_from input');
   const rang2 = document.querySelector('.filter__input_to input');
   const rangArray = [rang1, rang2];
   let filteredProducts = [];

   // - - - - - - - [стоврення range slider] - - - - - - - - - - - - - - - - - - - - - - - - - - - -
   if (rangeSlider) {
      function initRangeSlider() {
         noUiSlider.create(rangeSlider, {
            start: [100, 5000],
            connect: true,
            step: 1,
            range: {
               'min': 100,
               'max': 5000
            }
         });
         rangeSlider.noUiSlider.on('update', function(values, handle) {
            rangArray[handle].value = Math.round(values[handle]); // Передаем значение ползунков в input
         });
         const setRangeValue = (i, value) => {
            const arr = [null, null];
            arr[i] = value;
            rangeSlider.noUiSlider.set(arr);
         };

         rangArray.forEach((el, index) => {
            el.addEventListener('change', (e) => {
               setRangeValue(index, e.currentTarget.value);
            });
         });
      }
      initRangeSlider()
   }

   // - - - - - - - [фільтрація товарів] - - - - - - - - - - - - - - - - - - - - - - - - - - - -
   function filterProducts() {
      const minPrice = rangeSlider.noUiSlider.get(true)[0];
      const maxPrice = rangeSlider.noUiSlider.get(true)[1];
      const checkedCategories = [...document.querySelectorAll('.filter__item input:checked')].map((item) => item.id);
      const checkedType = [...document.querySelectorAll('.type-products__item input:checked')].map((item) => item.id).toString();
      filteredProducts = products.filter((product) => {
         const productCategories = [product.dataset.subject, product.dataset.features].filter(Boolean);
         const productPrice = product.querySelector('.item-products__price span').textContent;
         return checkedCategories.some((category) => productCategories.includes(category)) &&
            (checkedType === 'all' || checkedType === product.dataset.type) &&
            productPrice >= minPrice && productPrice <= maxPrice;
      });
      productContainer.textContent = '';
      filteredProducts.forEach((product) => {
         productContainer.append(product);
      });
   }

   const typeButtons = document.querySelectorAll('.type-products__item');
   typeButtons.forEach((button) => {
      button.addEventListener('click', filterProducts)
   })

   const filterButton = document.querySelector('.filter__enter-price');
   filterButton.addEventListener('click', filterProducts);


   // - - - - - - - [сортування по ціні] - - - - - - - - - - - - - - - - - - - - - - - - - - - -
   function sortByPriceAscending() {
      const sortedProducts = filteredProducts.length === 0 ? products : filteredProducts;
      sortedProducts.sort((a, b) => {
         const priceA = parseInt(a.querySelector('.item-products__price span').textContent);
         const priceB = parseInt(b.querySelector('.item-products__price span').textContent);
         return priceA - priceB;
      });
      productContainer.textContent = '';
      sortedProducts.forEach((product) => {
         productContainer.append(product);
      });
   }

   const sortPriceButton = document.querySelector('.products__sort-price button');
   sortPriceButton.addEventListener('click', sortByPriceAscending);


   // - - - - - - - [відкрити фільтра панель] - - - - - - - - - - - - - - - - - - - - - - - - - - - -
   document.addEventListener('click', delegation);

   function delegation(e) {
      const targetElement = e.target;
      if (targetElement.closest('.products__open-filter')) {
         document.querySelector('.filter').classList.toggle('_active-panel');
      } else if (!targetElement.closest('.filter')) {
         document.querySelector('.filter').classList.remove('_active-panel');
      }
   }
}