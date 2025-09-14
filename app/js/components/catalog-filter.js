//===================================================
//фильтр в каталоге
//===================================================
  const form = document.querySelector(".filter__form");

  if (form) {
    const activeBlock = document.querySelector(".filter__active");
    const filterResult = document.querySelector(".filter__result");
    const resetBtn = document.querySelector(".filter__reset");
    const applyBtn = document.querySelector(".filter__apply");

    const rangeInputs = document.querySelectorAll(".price-range__input");
    const progress = document.querySelector(".price-range__progress");
    const minLabel = document.querySelector(".price-range__min-label");
    const maxLabel = document.querySelector(".price-range__max-label");
    if (!rangeInputs.length) {
      return;
    }
    const maxRange = rangeInputs[0].max
    const defaultMinValue = parseInt(rangeInputs[0].value, 10);
    const defaultMaxValue = parseInt(rangeInputs[1].value, 10);

    const labelsMap = {
      brand: "Бренд",
      size: "Размер",
      length: "Длина платья",
      color: "Цвет",
      "price-range__min-label": "Цена",
    };

    // -------- Цена --------
    const fmt = (num) => `${Number(num).toFixed(2)} EUR`;

    function updateSlider() {
      let minVal = parseInt(rangeInputs[0].value, 10);
      let maxVal = parseInt(rangeInputs[1].value, 10);

      if (minVal > maxVal) {
        [minVal, maxVal] = [maxVal, minVal];
        rangeInputs[0].value = minVal;
        rangeInputs[1].value = maxVal;
      }

      const minPercent = (minVal / maxRange) * 100;
      const maxPercent = (maxVal / maxRange) * 100;

      progress.style.left = `${minPercent}%`;
      progress.style.width = `${maxPercent - minPercent}%`;

      minLabel.textContent = fmt(minVal);
      maxLabel.textContent = fmt(maxVal);
    }

    rangeInputs.forEach((input) => {
      input.addEventListener("input", updateSlider);
    });

    updateSlider();

    // -------- Активные фильтры --------
    function updateActiveFilters() {
      activeBlock.innerHTML = "";

      const formData = new FormData(form);
      const grouped = {};

      formData.forEach((value, key) => {
        if (key === "price-range__min-label" || key === "price-range__max-label") return;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(value);
      });

      const currentMin = parseInt(rangeInputs[0].value, 10);
      const currentMax = parseInt(rangeInputs[1].value, 10);

      grouped["price-range__min-label"] = [`${fmt(currentMin)} – ${fmt(currentMax)}`];

      Object.keys(grouped).forEach((groupKey) => {
        const wrapper = document.createElement("div");
        wrapper.className = "filter__active-group";

        const groupTitle = document.createElement("div");
        groupTitle.className = "filter__active-title";
        groupTitle.textContent = (labelsMap[groupKey] || groupKey) + ":";
        wrapper.appendChild(groupTitle);

        const valuesContainer = document.createElement("div");
        valuesContainer.className = "filter__active-values";

        grouped[groupKey].forEach((val) => {
          const item = document.createElement("span");
          item.className = "filter__active-item";

          if (groupKey === "color") {
            item.innerHTML = `
          <span class="filter__color" style="background-color: #${val};"></span>
          <button type="button" class="filter__remove" data-key="${groupKey}" data-value="${val}"></button>
        `;
          } else {
            item.innerHTML = `
          <span class="filter__active-name">${val}</span>
          <button type="button" class="filter__remove" data-key="${groupKey}" data-value="${val}"></button>
        `;
          }
          valuesContainer.appendChild(item);
        });

        wrapper.appendChild(valuesContainer);
        activeBlock.appendChild(wrapper);
      });
    }

    // -------- Удаление --------
    activeBlock.addEventListener("click", (e) => {
      if (e.target.classList.contains("filter__remove")) {
        const key = e.target.dataset.key;
        const value = e.target.dataset.value;

        if (key === "price-range__min-label" || key === "price-range__max-label") {
          rangeInputs[0].value = defaultMinValue;
          rangeInputs[1].value = defaultMaxValue;
          updateSlider();
        } else {
          const inputs = form.querySelectorAll(`[name="${key}"]`);
          inputs.forEach((input) => {
            if (input.type === "checkbox" && input.value === value) {
              input.checked = false;
            }
          });
        }
        updateActiveFilters();
      }
    });

    // -------- Кнопка "Применить" --------
    applyBtn.addEventListener("click", (e) => {
      e.preventDefault();
      updateActiveFilters();
      filterResult.classList.add("filter__result--visible"); // показываем блок
    });

    // -------- Слушатели --------
    form.addEventListener("input", (e) => {
      if (e.target.classList && e.target.classList.contains("price-range__input")) {
        updateSlider();
      }
    });

    resetBtn.addEventListener("click", () => {
      form.reset();
      updateSlider();
      activeBlock.innerHTML = "";
      filterResult.classList.remove("filter__result--visible");
    });
  }