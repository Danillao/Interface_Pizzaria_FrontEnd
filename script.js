// array que será o carrinho
let cart = [];

// Quantidade de pizzas a ser apresentada no modal
let modalQT = 1;

// ID da Pizza selecionada sera armezenada nessa variavel
let modalKey = 0;

// Atribuindo o document.querySelector() e o document.querySelectorAll() em constantes para evitar repetição de codigo
const select = (elemento) => document.querySelector(elemento);
const selectAll = (elemento) => document.querySelectorAll(elemento);

//LISTAGEM DAS PIZZAS

/*  1 - Estamos mapeando o json que contem as pizzas, e criando uma função que recebe a pizza(item) e o id da pizza(index)
    2 - Estamos pegando uma parte do html que apresenta as pizzas e vamos: clonar, preencher e jogar na tela
*/
pizzaJson.map( (item, index) => {
    // Clonando item
    let pizzaItem = select('.models .pizza-item').cloneNode(true);


    // Atribuindo id da pizza em pizzaItem  
    pizzaItem.setAttribute('data-key', index);

    // Recuperando imagem da pizza e jogando na tela
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;

    // Recuperando nome da pizza e jogando na tela
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;

    // Recuperando descrição da pizza e jogando na tela
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    // Recuperando preço da pizza formatando e jogando na tela
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;

    /* 1 - Recuperando o link da pizza selecionada
       2 - Retirando comportamento padrão de atualizar tela ao ser clicado
       3 - Manipulando o css de .pizzaWindowArea para apresentar o modal ao ser clicado
    */
    pizzaItem.querySelector('a').addEventListener('click', (evento) => {

        evento.preventDefault();

        /* 1 - procurando elemento mais proximo que possua a class .pizza-item 
           2 - Pegando o atributo data-key(id da pizza) atraves do getAttribute()
        */
        let key = evento.target.closest('.pizza-item').getAttribute('data-key');

        // Sempre ao abrir o modal a quantidade de pizzas seta em 1
        modalQT = 1; 

        // Atribuindo a var qual pizza foi selecionada
        modalKey = key;


        // Recuperando imagem da pizza clicada e atribuindo ao modal
        select('.pizzaBig img').src = pizzaJson[key].img;
           
        // Recuperando o nome da pizza clicada e atribuindo ao titulo do modal
        select('.pizzaInfo h1').innerHTML = pizzaJson[key].name;

        // Recuperando a descrição da pizza clicada e atribuindo ao modal
        select('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;

        // Recuperando o preço da pizza clicada e atribuindo ao modal
        select('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`
        
        // desselecionando o tamanho que vem selecionado por padrão
        select('.pizzaInfo--size.selected').classList.remove('selected');

        // Recuperando os tamanhos da pizza clicada e atribuindo ao modal o peso X tamanho
        selectAll('.pizzaInfo--size').forEach( (size, sizeIndex) => {

            // Selecionando o tamanho grande para ser o padrão
            if (sizeIndex == 2) {
                size.classList.add('selected');
            }

            size.querySelector('span').innerHTML =  pizzaJson[key].sizes[sizeIndex];
        });

        // Recuperando a quantidade de pizzas e atribuindo ao modal
        select('.pizzaInfo--qt').innerHTML = modalQT;

        // Manipulando CSS de .pizzaWindowArea para criar uma animação que abre o modal
        select('.pizzaWindowArea').style.opacity = 0;
        select('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
            select('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });
    

    // Preenchendo as informações em pizzaitem
    select('.pizza-area').append( pizzaItem );
});


//EVENTOS DO MODAL

//Fecha o modal 
function closeModal()
{
    // Manipulando CSS de .pizzaWindowArea para criar uma animação que fecha o modal
    select('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        select('.pizzaWindowArea').style.display = 'none';
    }, 700);
}


// Selecionando botoes de cancelar e voltar e atribuindo o comportamendo da função closeModal() aos botoes
selectAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {

    item.addEventListener('click', closeModal);
});

// Aumenta a quantidade de pizzas no modal
select('.pizzaInfo--qtmais').addEventListener('click', () => {

    modalQT++;

    select('.pizzaInfo--qt').innerHTML = modalQT;
});

// Diminui a quantidade de pizzas no modal
select('.pizzaInfo--qtmenos').addEventListener('click', () => {

    if (modalQT > 1) {

        modalQT--;

        select('.pizzaInfo--qt').innerHTML = modalQT;
    }
});


// Recuperando os tamanhos da pizza clicada e atribuindo ao modal o peso X tamanho
selectAll('.pizzaInfo--size').forEach( (size, sizeIndex) => {

    // Desmarca todos os tamanhos e marca o tamanho que o usuario quer
    size.addEventListener('click', () => {

        // desmarcando o tamanho que vem selecionado por padrão
        select('.pizzaInfo--size.selected').classList.remove('selected');
        // marcando o item selecionado
        size.classList.add('selected');
    });
});


//CARRINHO

// Recupera o botao de add ao carrinho e faz um push das infos no array do carrinho
select('.pizzaInfo--addButton').addEventListener('click', () => {
    
    let size = parseInt(select('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identifier = pizzaJson[modalKey].id+' @ '+size;

    let key = cart.findIndex( (item) => {

        return item.identifier == identifier;
    });

    if (key > -1) {

        cart[key].qt += modalQT;

    } else {
        // add ao carrinho o id, tamanho e quantidade
        cart.push({ 
            identifier: identifier,
            id: pizzaJson[modalKey].id,
            size: size,
            qt: modalQT
        });
    }

    updateCart();

    closeModal();
});

select('.menu-openner').addEventListener('click',() => {
    if (cart.length > 0) {
        select('aside').style.left = '0';
    }
});

select('.menu-closer').addEventListener('click',() => {
    select('aside').style.left = '100vw';
});


// Adiciona itens ao carrinho
function updateCart() 
{
    select('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0) {
        select('aside').classList.add('show');

        select('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {

            let pizzaItem = pizzaJson.find((item) => {
                return item.id == cart[i].id;
            });
            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = select('.models .cart--item').cloneNode(true);

            let pizzaSizeName;

            switch(cart[i].size)
            {
                case 0 :
                    pizzaSizeName = 'P';
                    break;
                case 1 :
                    pizzaSizeName = 'M';
                    break;
                case 2 :
                    pizzaSizeName = 'G';
                    break;
            }

            let pizzaName = `${pizzaItem.name} ( ${pizzaSizeName} )`;


            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart(); 
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });

            select('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        select('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        select('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        select('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        select('aside').classList.remove('show');
        select('aside').style.left = '100vw';
    }
}