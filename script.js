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
    let html = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; padding: 20px; width: 100%;">
    `;

    snap.forEach((p) => {
      const d = p.val();
      const id = p.key; // প্ল্যানের আইডি
      
      html += `
        <div style="background: white; padding: 30px; border-radius: 25px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border: 1px solid #f1f5f9; display: flex; flex-direction: column; justify-content: space-between; transition: 0.3s;">
            <div>
                <h3 style="font-size: 24px; font-weight: 900; margin-bottom: 10px; color: #1e293b;">${d.name}</h3>
                <div style="color: #64748b; margin-bottom: 20px; font-size: 14px; font-weight: 500;">
                    <ul class="space-y-2 text-sm mb-6">
                </div>
                <div style="font-size: 36px; font-weight: 900; color: #4f46e5; margin-bottom: 25px;">
                    <span style="font-size: 18px;">BDT</span> ${d.price}
                </div>
                <ul style="list-style: none; padding: 0; margin-bottom: 30px; color: #475569; font-size: 14px; line-height: 2;">
   <li class="font-bold text-[15px] text-slate-700">
✔️ ${d.ram}


</li>

<li class="font-bold text-[15px] text-slate-700">
✔️ ${d.cpu}
</li>

<li class="font-bold text-[15px] text-slate-700">
✔️ ${d.storage}
</li>

<li class="font-bold text-[15px] text-slate-700">
✔️ ${d.bandwidth}
</li>

<li class="font-bold text-[15px] text-slate-700">
✔️ Full Root Access
</li>

<li class="font-bold text-[15px] text-slate-700">
✔️ Linux OS
</li>


            <button class="buy-plan-btn" data-id="${id}" data-name="${d.name}" style="width: 100%; background: #0f172a; color: white; padding: 15px; border-radius: 15px; border: none; font-weight: bold; cursor: pointer;">
                Order Now
            </button>
        </div>
      `;
    });

    html += '</div>';
    const container = document.getElementById("plansContainer");
    if(container) {
        container.innerHTML = html;
    }
  });
}
// ================= DYNAMIC BUY SYSTEM =================
// ================= DYNAMIC BUY SYSTEM (সংশোধিত) =================

document.addEventListener("click", (e) => {
    // এখানে target এবং attribute সরাসরি চেক করা হয়েছে যাতে কোনো মিস না হয়
    const btn = e.target.closest(".buy-plan-btn");

    if (btn) {
        const user = auth.currentUser;

        if (!user) {
            modal.classList.add("active");
            alert("Please Login First to Place Order");
            return;
        }

        // dataset এর বদলে getAttribute ব্যবহার করা হয়েছে যা সব ব্রাউজারে কাজ করে
        const planId = btn.getAttribute("data-id");
        const planName = btn.getAttribute("data-name");

        const txid = prompt("প্ল্যান: " + planName + "\nবিকাশ/নগদ TXID দিন:");

        if (!txid) {
            alert("Transaction ID ইজ রিকোয়ার্ড!");
            return;
        }

        const orderRef = db.ref("orders").push();

        orderRef.set({
            email: user.email,
            userId: user.uid,
            planId: planId,
            plan: planName,
            txid: txid,
            status: "Pending",
            createdAt: Date.now(),
            server: null
        }).then(() => {
            alert("অর্ডার সফল হয়েছে! এডমিন এপ্রুভ করলে My Orders-এ সব পাবেন।");
        }).catch((err) => {
            alert("Error: " + err.message);
        });
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
// ================= LOAD CUSTOMER ORDERS (FIXED) =================

function loadOrders(email) {
    console.log("Loading orders for: " + email); // চেক করার জন্য কনসোলে মেসেজ দিবে

    // আমরা সরাসরি সব অর্ডার নিয়ে আসব এবং কোডের ভেতরে ফিল্টার করব
    db.ref("orders").on("value", (snap) => {
        let html = "";
        let count = 0;

        snap.forEach((child) => {
            const o = child.val();
            
            // ইমেইল চেক করা হচ্ছে (সবগুলো ছোট হাতের অক্ষরে মিলিয়ে)
            if (o.email && o.email.toLowerCase() === email.toLowerCase()) {
                count++;
                
                let statusClass = (o.status === 'Pending') ? 'text-orange-500' : 'text-green-600';
                let serverInfo = "";

                if (o.server) {
                    serverInfo = `
                    <div class="mt-4 bg-slate-100 p-4 rounded-xl border border-slate-200">
                        <div class="mb-1 text-xs text-slate-400 font-bold uppercase tracking-wider">Server Details</div>
                        <div class="grid grid-cols-1 gap-2 text-sm mt-2">
                            <div><b>IP:</b> ${o.server.ip}</div>
                            <div><b>User:</b> ${o.server.username}</div>
                            <div><b>Pass:</b> ${o.server.password}</div>
                            <div><b>Port:</b> ${o.server.port}</div>
                            <div><b>Expire:</b> ${o.server.expire}</div>
                        </div>
                        <button onclick="copyText('${o.server.ip}')" class="w-full bg-indigo-600 text-white px-3 py-2 rounded-xl mt-3 text-xs font-bold">
                            Copy Server IP
                        </button>
                    </div>`;
                }

                html += `
                <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-4">
                    <div class="flex justify-between items-start">
                        <div>
                            <div class="text-xs text-slate-400 font-bold uppercase mb-1">Plan Name</div>
                            <b class="text-lg text-slate-800">${o.plan}</b>
                        </div>
                        <span class="${statusClass} font-black px-3 py-1 bg-slate-50 rounded-lg text-sm border">
                            ${o.status}
                        </span>
                    </div>
                    <div class="mt-3 text-xs text-slate-500 font-medium">
                        <i class="fa-solid fa-receipt mr-1"></i> TXID: ${o.txid}
                    </div>
                    ${serverInfo}
                </div>`;
            }
        });

        const container = document.getElementById("orderContainer");
        if (container) {
            container.innerHTML = (count > 0) ? html : `
                <div class="text-center p-10 bg-white rounded-3xl border border-dashed border-slate-200">
                    <p class="text-slate-400">আপনার কোনো অর্ডার পাওয়া যায়নি।</p>
                </div>`;
        }
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



// ================= ADD NEW PLAN (ADMIN ONLY) =================
window.addNewPlan = () => {
    // ইনপুট ফিল্ড থেকে ডাটা নেওয়া
    const name = document.getElementById("pName").value;
    const ram = document.getElementById("pRam").value;
    const cpu = document.getElementById("pCpu").value;
    const price = document.getElementById("pPrice").value;
    const storage = document.getElementById("pStorage").value;
    const bandwidth = document.getElementById("pBandwidth").value;

    // ভ্যালিডেশন: নাম এবং দাম অন্তত থাকতে হবে
    if(!name || !price) {
        alert("দয়া করে প্ল্যানের নাম এবং দাম লিখুন!");
        return;
    }

    // আপনার Firebase কনফিগারেশন অনুযায়ী 'plans' নোডে ডাটা পাঠানো
    // এটি হুবহু ফায়ারবেজ কনসোলে হাত দিয়ে করার মতোই কাজ করবে
    const planRef = db.ref("plans").push();

    planRef.set({
        name: name,
        ram: ram,
        cpu: cpu,
        price: price,
        storage: storage,
        bandwidth: bandwidth,
        createdAt: Date.now()
    })
    .then(() => {
        alert("অভিনন্দন! নতুন সার্ভার কার্ডটি ওয়েবসাইটে যুক্ত হয়েছে। 😎");
        
        // অ্যাড করার পর ইনপুট বক্সগুলো খালি করে দেওয়া
        document.getElementById("pName").value = "";
        document.getElementById("pRam").value = "";
        document.getElementById("pCpu").value = "";
        document.getElementById("pPrice").value = "";
        document.getElementById("pStorage").value = "";
        document.getElementById("pBandwidth").value = "";
        
        // কাস্টমার স্টোর সেকশনে অটোমেটিক কার্ড চলে আসবে কারণ loadPlans-এ .on("value") দেওয়া আছে
    })
    .catch((err) => {
        alert("ডাটা পাঠাতে সমস্যা হয়েছে: " + err.message);
        console.error(err);
    });
};


