document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('orderForm');
    const ordersContainer = document.getElementById('ordersContainer');

    // Fetch and display existing orders
    fetchOrders();

    // Handle form submission
    orderForm.addEventListener('submit', function(event) {
        event.preventDefault();
        submitOrder();
    });


    function submitOrder(){
        values =  getFormValues();
        let clientId = postClient(values.nomClient, values.prenomClient);
        let glaceId = postGlaces(values.gout, values.taille);
        let preparateurId = getRandomPreparateur();
        clientId.then((clientId) => {
            glaceId.then((glaceId) => {
                preparateurId.then((preparateurId) => {
                    let commandeId =  postCommande(clientId, glaceId, preparateurId);
                });
            });
        });
        // let commandeId = postCommande(clientId, glaceId, preparateurId, "en cours");
        // console.log("--------------------" + commandeId._id + "-------------------");
        orderForm.reset();
        fetchOrders();
    }


    function getFormValues() {
        const nomClient = document.getElementById('nomClient').value;
        const prenomClient = document.getElementById('prenomClient').value;
        const gout = document.getElementById('gout').value;
        const taille = document.getElementById('taille').value;
        return { nomClient : nomClient,
            prenomClient :  prenomClient,
            gout : gout,
            taille : taille
        };
    }


    async function postCommande(clientId, glaceId, preparateurId, statut){
        console.log("Client : ");
        console.log(clientId);
        console.log("Glace : ");
        console.log(glaceId);
        console.log("Preparateur : ");
        console.log(preparateurId);
        console.log(statut);
        try{
            const responseFetch = await fetch(`http://localhost:3000/commandes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    clientId: clientId,
                    glaceId : glaceId,
                    preparateurId : preparateurId,
                    statut : statut
                })
            });
            if (!responseFetch.ok) {
                throw new Error(`Erreur HTTP : ${responseFetch.status}`);
            }
            const dataFetch = await responseFetch.json();
            return dataFetch._id;
        } catch (error) {
            console.error("Erreur fetch :", error);
        }
    }

    async function postGlaces(gout, taille){
        try{
            const responseFetch = await fetch(`http://localhost:3000/glaces`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    gout: gout,
                    taille : taille
                })
            });
            if (!responseFetch.ok) {
                throw new Error(`Erreur HTTP : ${responseFetch.status}`);
            }
            const dataFetch = await responseFetch.json();
            return dataFetch._id;
        } catch (error) {
            console.error("Erreur fetch :", error);
        }
    }


    async function postClient(nomClient, prenomClient){
        try{
            const responseFetch = await fetch(`http://localhost:3000/clients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nom: nomClient,
                    prenom : prenomClient
                })
            });
            if (!responseFetch.ok) {
                throw new Error(`Erreur HTTP : ${responseFetch.status}`);
            }
            const dataFetch = await responseFetch.json();
            console.log(dataFetch);
            return dataFetch._id;
        } catch (error) {
            console.error("Erreur fetch :", error);
        }
    }


    async function getRandomPreparateur(){
        try{
            const responseFetch = await fetch(`http://localhost:3000/preparateurs`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!responseFetch.ok) {
                throw new Error(`Erreur HTTP : ${responseFetch.status}`);
            }
            const dataFetch = await responseFetch.json();
            const preparateur =  dataFetch[Math.floor(Math.random() * dataFetch.length)];
            return preparateur._id;
        } catch (error) {
            console.error("Erreur fetch :", error);
        }
    }


    // Fetch orders from the API
    async function fetchOrders() {
        try{
            const responseFetch = await fetch(`http://localhost:3000/commandes`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!responseFetch.ok) {
                throw new Error(`Erreur HTTP : ${responseFetch.status}`);
            }
            const dataFetch = await responseFetch.json();
            dataFetch.forEach(async order => {
                    client = await getClientByID(order.clientId);
                    glace = await getGlaceByID(order.glaceId);
                    preparateur = await getPreparateurByID(order.preparateurId);
                    statut = order.statut;
                if (client && glace && preparateur) {
                    ordersContainer.innerHTML += `
                        <div class="order-item">
                            <h2>Commande : ${order._id}</h2>
                            <p>Client : ${client.nom} ${client.prenom}</p>
                            <p>Glace : ${glace.gout}</p>
                            <p>Préparateur : ${preparateur.nom} ${preparateur.prenom}</p>
                            <p>Statut : ${statut}</p>
                        </div>
                    `;
                }
            });

        } catch (error) {
            console.error("Erreur fetch :", error);
        }
    }


    async function getGlaceByID(id) {
        try{
            const responseFetch = await fetch(`http://localhost:3000/glaces/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!responseFetch.ok) {
                throw new Error(`Erreur HTTP : ${responseFetch.status}`);
            }
            const dataFetch = await responseFetch.json();
            return dataFetch;

        } catch (error) {
            console.error("Erreur fetch :", error);
        }        
    }


    async function getPreparateurByID(id) {
        try{
            const responseFetch = await fetch(`http://localhost:3000/preparateurs/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!responseFetch.ok) {
                throw new Error(`Erreur HTTP : ${responseFetch.status}`);
            }
            const dataFetch = await responseFetch.json();
            return dataFetch;

        } catch (error) {
            console.error("Erreur fetch :", error);
        }        
    }


    async function getClientByID(id) {
        try{
            const responseFetch = await fetch(`http://localhost:3000/clients/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!responseFetch.ok) {
                throw new Error(`Erreur HTTP : ${responseFetch.status}`);
            }
            const dataFetch = await responseFetch.json();
            return dataFetch;

        } catch (error) {
            console.error("Erreur fetch :", error);
        }        
    }
});