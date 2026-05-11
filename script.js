const firebaseConfig = {
  apiKey: "AIzaSyAxQXR_DgqJIHjK9bT44OFezva7Qt4U20o",
  authDomain: "atikul-vps.firebaseapp.com",
  databaseURL: "https://atikul-vps-default-rtdb.firebaseio.com",
  projectId: "atikul-vps",
  storageBucket: "atikul-vps.firebasestorage.app",
  messagingSenderId: "794605033450",
  appId: "1:794605033450:web:012af915359fb8abe70493",
  measurementId: "G-VRZQFBQSKM"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

const ADMINS = [
    "atikulislam.as2026@gmail.com"
];

const modal = document.getElementById("modalOverlay");


// ================= SECTION SWITCH =================

document.getElementById("btnStore").onclick = () => {
    switchSection("store");
};

document.getElementById("btnOrders").onclick = () => {
    switchSection("orders");
};

document.getElementById("adminMenu").onclick = () => {
    switchSection("admin");
};

function switchSection(name){

    document.getElementById("store-section")
    .classList.add("hidden");

    document.getElementById("orders-section")
    .classList.add("hidden");

    document.getElementById("admin-section")
    .classList.add("hidden");

    document.getElementById(name + "-section")
    .classList.remove("hidden");

}


// ================= LOGIN BUTTON =================

document.getElementById("authBtn").onclick = () => {

    if(auth.currentUser){

        auth.signOut();

    }else{

        modal.classList.add("active");

    }

};


// ================= CLOSE MODAL =================

document.getElementById("closeModal").onclick = () => {

    modal.classList.remove("active");

};


// ================= SWITCH REGISTER =================

document.getElementById("toReg").onclick = () => {

    document.getElementById("loginFormArea")
    .classList.add("hidden");

    document.getElementById("regFormArea")
    .classList.remove("hidden");

};


// ================= SWITCH LOGIN =================

document.getElementById("toLog").onclick = () => {

    document.getElementById("regFormArea")
    .classList.add("hidden");

    document.getElementById("loginFormArea")
    .classList.remove("hidden");

};


// ================= LOGIN =================

document.getElementById("loginNow").onclick = () => {

    const email =
    document.getElementById("loginEmail").value;

    const pass =
    document.getElementById("loginPass").value;

    if(!email || !pass){

        alert("Enter email & password");
        return;

    }

    auth.signInWithEmailAndPassword(email, pass)

    .then(() => {

        modal.classList.remove("active");

        alert("Login Success");

    })

    .catch((err) => {

        alert(err.message);

    });

};


// ================= REGISTER =================

document.getElementById("regNow").onclick = () => {

    const name =
    document.getElementById("regName").value;

    const email =
    document.getElementById("regEmail").value;

    const pass =
    document.getElementById("regPass").value;

    if(!name || !email || !pass){

        alert("Fill all fields");
        return;

    }

    auth.createUserWithEmailAndPassword(email, pass)

    .then((res) => {

        db.ref("users/" + res.user.uid).set({

            name: name,
            email: email

        });

        modal.classList.remove("active");

        alert("Account Created");

    })

    .catch((err) => {

        alert(err.message);

    });

};


// ================= LOAD PLANS =================

function loadPlans() {
  db.ref("plans").on("value", (snap) => {
    // এখানে কার্ডগুলো সাজানোর জন্য মেইন কন্টেইনার তৈরি করা হয়েছে
    let html = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; padding: 20px; width: 100%;">
    `;

    snap.forEach((p) => {
      const d = p.val();
      
      html += `
        <div style="background: white; padding: 30px; border-radius: 25px; shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border: 1px solid #f1f5f9; display: flex; flex-direction: column; justify-content: space-between; transition: 0.3s;">
            <div>
                <h3 style="font-size: 24px; font-weight: 900; margin-bottom: 10px; color: #1e293b;">${d.name}</h3>
                <div style="color: #64748b; margin-bottom: 20px; font-size: 14px; font-weight: 500;">
                    ${d.ram} • ${d.cpu}
                </div>
                <div style="font-size: 36px; font-weight: 900; color: #4f46e5; margin-bottom: 25px;">
                    <span style="font-size: 18px;">BDT</span> ${d.price}
                </div>
                <ul style="list-style: none; padding: 0; margin-bottom: 30px; color: #475569; font-size: 14px; line-height: 2;">
                    <li>✅ ${d.storage}</li>
                    <li>✅ ${d.bandwidth}</li>
                    <li>✅ Full Root Access</li>
                    <li>✅ Linux OS</li>
                </ul>
            </div>
            <button class="buy-plan-btn" data-plan="${d.name}" style="width: 100%; background: #0f172a; color: white; padding: 15px; border-radius: 15px; border: none; font-weight: bold; cursor: pointer;">
                Order Now
            </button>
        </div>
      `;
    });

    html += '</div>'; // কন্টেইনার শেষ

    const container = document.getElementById("plansContainer");
    if(container) {
        container.innerHTML = html;
        // কার্ডগুলো দেখানোর পর বাটনগুলো একটিভ করা
        if (typeof setupBuyButtons === "function") setupBuyButtons();
    }
  });
}
// ================= DYNAMIC BUY SYSTEM =================

document.addEventListener("click",(e)=>{

if(e.target.classList.contains("buy-plan-btn")){

const user = auth.currentUser;

if(!user){

modal.classList.add("active");
return;

}

const planId = e.target.dataset.id;
const planName = e.target.dataset.name;

const txid = prompt("Enter Bkash/Nagad TXID");

if(!txid) return;

const orderRef = db.ref("orders").push();

orderRef.set({

email:user.email,
planId:planId,
plan:planName,
txid:txid,
status:"Pending",
createdAt:Date.now()

});

alert("Order Placed");

}

});


// ================= AUTH STATE =================

auth.onAuthStateChanged((user) => {

    loadPlans();

    const status =
    document.getElementById("userStatus");

    const authBtn =
    document.getElementById("authBtn");

    const adminMenu =
    document.getElementById("adminMenu");

    if(user){

        status.innerText =
        "Logged in: " + user.email;

        authBtn.innerText = "Logout";

        loadOrders(user.email);

        if(ADMINS.includes(user.email)){

            adminMenu.classList.remove("hidden");

            loadAdmin();

        }else{

            adminMenu.classList.add("hidden");

        }

    }else{

        status.innerText = "Guest Mode";

        authBtn.innerText = "Login";

        adminMenu.classList.add("hidden");

        document.getElementById("orderContainer")
        .innerHTML = "Login to see orders.";

    }

});


// ================= LOAD CUSTOMER ORDERS =================

function loadOrders(email){

    db.ref("orders")
    .orderByChild("email")
    .equalTo(email)

    .on("value", (snap) => {

        let html = "";

        snap.forEach((c) => {

            const o = c.val();

            let serverInfo = "";

            if(o.server){

                serverInfo = `

                <div class="mt-4 bg-slate-100 p-4 rounded-xl">

                    <div class="mb-2">
                        <b>IP:</b> ${o.server.ip}
                    </div>

                    <div class="mb-2">
                        <b>User:</b> ${o.server.username}
                    </div>

                    <div class="mb-2">
                        <b>Password:</b> ${o.server.password}
                    </div>

                    <div class="mb-2">
                        <b>Port:</b> ${o.server.port}
                    </div>

                    <div class="mb-2">
                        <b>Expire:</b> ${o.server.expire}
                    </div>

                    <button
                    onclick="copyText('${o.server.ip}')"
                    class="bg-indigo-600 text-white px-3 py-2 rounded mt-2">

                        Copy IP

                    </button>

                </div>

                `;

            }

            html += `

            <div class="bg-white p-5 rounded-2xl border mb-4">

                <div class="flex justify-between items-center">

                    <b>${o.plan}</b>

                    <span class="${
                        o.status === 'Pending'
                        ? 'text-orange-500'
                        : 'text-green-600'
                    } font-bold">

                        ${o.status}

                    </span>

                </div>

                <div class="mt-2 text-sm text-slate-500">
                    TXID: ${o.txid}
                </div>

                ${serverInfo}

            </div>

            `;

        });

        document.getElementById("orderContainer")
        .innerHTML = html || "No Orders Found";

    });

}


// ================= LOAD ADMIN PANEL =================

function loadAdmin(){

    db.ref("orders").on("value", (snap) => {

        let html = "";

        snap.forEach((c) => {

            const o = c.val();

            const id = c.key;

            let actionBtn = "";

            if(o.status === "Pending"){

                actionBtn = `

                <button
                onclick="openServerModal('${id}')"
                class="bg-indigo-600 text-white px-3 py-2 rounded">

                    Approve

                </button>

                `;

            }else{

                actionBtn = `

                <span class="text-green-600 font-bold">
                    Active
                </span>

                `;

            }

            html += `

            <tr class="border-b">

                <td class="p-3 text-xs">
                    ${o.email}
                </td>

                <td class="p-3 text-xs">
                    ${o.plan}
                </td>

                <td class="p-3 text-xs">
                    ${o.txid}
                </td>

                <td class="p-3">
                    ${actionBtn}
                </td>

            </tr>

            `;

        });

        document.getElementById("adminTableBody")
        .innerHTML = html;

    });

}


// ================= APPROVE + SERVER INFO =================

window.openServerModal = (id) => {

    const ip = prompt("Enter Server IP");
    if(!ip) return;

    const username = prompt("Enter Username");
    if(!username) return;

    const password = prompt("Enter Password");
    if(!password) return;

    const port = prompt("Enter Port");
    if(!port) return;

    const expire = prompt("Expire Date / Days");
    if(!expire) return;

    db.ref("orders/" + id).update({

        status: "Active",

        server: {

            ip: ip,
            username: username,
            password: password,
            port: port,
            expire: expire

        }

    });

    alert("Server Delivered");

};


// ================= COPY FUNCTION =================

window.copyText = (text) => {

    navigator.clipboard.writeText(text);

    alert("Copied: " + text);

};