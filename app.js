const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


const app = (() => {
    const input = $('#input');
    const button = $('#add-btn');
    const root = $('#root');

    let key = "CAR_MANAGER";
    let cars = [];

    return {
        render(slide) {
            if (cars.length == 0) {
                root.innerHTML = `
                <p style="text-align:center; font-size:20px; margin-top:12px">
                EMPTY GARAGE
                </p>
                `;
                return;
            }
            const html = cars.map((car, index) => {
                return `
                    <li 
                        data-index=${index}
                        class=${slide && index==cars.length-1? "slide" : ''}
                    >
                        ${car} 
                        <span title="delete this">X</span>
                    </li>
                `
            });

            if (cars.length == 10) {
                html.push(`
                <h2 style="margin-top=0">FULL</h2>`)
            }
            root.innerHTML = html.join('');
        },
        add(car) {
            cars.push(car);
            this.setLocalData();
        },
        delete(index) {
            cars.splice(index, 1);
            this.setLocalData();
        },
        getLocalData() {
            const data = localStorage.getItem(key);
            return JSON.parse(data);
        },
        setLocalData() {
            localStorage.setItem(key, JSON.stringify(cars));
        },
        setCars(data) {
            cars = data;
        },
        init() {
            const handleClick = () => {
                const car = input.value;
                if (!car || cars.length == 10) return;

                this.add(car);
                this.render(true);
                input.value = '';
                input.focus();
            }

            const handleDelete = (e) => {
                const deleteElement = e.target;

                if (deleteElement.closest('span')){
                    let index = deleteElement.closest('li').dataset.index;
                    this.delete(index);
                    this.render()
                }
            }

            const handleEnter = (e) => {
                if (e.key === 'Enter') {
                    button.onclick();
                }
            }

            button.onclick = handleClick;
            root.onclick = handleDelete;
            input.onkeypress = handleEnter;

            const localData = this.getLocalData();
            if (Array.isArray(localData)){
                this.setCars(this.getLocalData());
            }
            this.render();
        }
    }
})();

app.init();