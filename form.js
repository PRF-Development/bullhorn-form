var candidate = {};

function updateCandidate() {
    full_name = document.getElementById("name").value;
    candidate.name = full_name;
    candidate.lastName = full_name.split(" ").filter((e) => e !== "M")[0];
    candidate.firstName = full_name.split(" ").filter((e) => e !== "M")[1];
    candidate.middleName = full_name
        .split(" ")
        .filter((e) => e !== "M")
        .splice(2)
        .join(" ");

    var address = document.getElementById("address").value;
    var ad = {};
    ad.address1 = address.replaceAll("\n", " ");
    ad.address2 = "";
    ad.zip = "";
    ad.city = "";
    ad.state = "";
    candidate.address = ad;

    var phone = document.getElementById("phone").value;
    candidate.mobile = phone;
    candidate.phone = phone;

    var email = document.getElementById("email").value;
    candidate.email = email;

    // var profile = document.getElementById("profile").value;
    // Ignore (always "freelance")

    var jobs = document.getElementById("jobs").value;
    candidate.occupation = jobs.substr(0, 50);

    var skills = document.getElementById("skills").value;
    candidate.skillSet = skills;

    var daily_rate = document.getElementById("daily_rate").value;
    candidate.dayRate = Number(daily_rate.replaceAll(/\D/g, ""));

    var availability = document.getElementById("availability").value;
    candidate.customFloat12 = Number(availability);

    var mobility = document.getElementById("mobility").value;
    candidate.address2 = mobility;

    var comment = document.getElementById("comment").value;
    candidate.comments = comment;

}

async function sendAll() {
    sendInfosBtn.style.disabled = true;
    sent_result.style.display = "block";
    sent_result.innerText = "Candidate being sent.";
    sent_result.style.color = "lightgreen";
    updateCandidate();
    // console.log(candidate);
    out = await put_candidate(candidate);
    console.log(out);
    var candidateId = out.changedEntityId;
    sent_result.style.display = "block";
    sent_result.innerText = "Candidate id: " + candidateId;
    sent_result.style.color = "green";
    candidate_link.style.display = "block";
    var link = `https://cls22.bullhornstaffing.com/BullhornStaffing/OpenWindow.cfm?id=${candidateId}&entity=Candidate&View=Overview`;
    candidate_link.innerHTML = `<a href="${link}" target="_blank">${link}</a>`
    sendInfosBtn.style.disabled = false;
}

sendInfosBtn.addEventListener("click", sendAll);