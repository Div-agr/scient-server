// controllers/seedController.js
const bcrypt = require("bcrypt");
const Club = require("../models/Club");
const { spider, delta, ecell, max, sigma, oedc, dc, naksh, psi, rmi, graphique, td, prof, fh, db, ever, scient } = require('../assets');

exports.seedClubs = async (req, res) => {
  try {
    // Sample clubs data to seed
    const clubsData = [
      {
        name: "SPIDER",
        username: "SPIDER_SCIEnT",
        credits: 14,
        password: await bcrypt.hash("spider1964", 10),
        logo: spider,
      },
      {
        name: "DELTA",
        username: "DELTA_SCIEnT",
        credits: 14,
        password: await bcrypt.hash("delta1964", 10),
        logo: delta,
      },
      {
        name: "E-CELL",
        username: "E-CELL_SCIEnT",
        credits: 14,
        password: await bcrypt.hash("ecell1964", 10),
        logo: ecell,
      },
      {
        name: "MAXIMUS",
        username: "MAXIMUS_SCIEnT",
        credits: 14,
        password: await bcrypt.hash("maximus1964", 10),
        logo: max,
      },
      {
        name: "SIGMA",
        username: "SIGMA_SCIEnT",
        credits: 14,
        password: await bcrypt.hash("sigma1964", 10),
        logo: sigma,
      },
      {
        name: "180-DC",
        username: "180DC_SCIEnT",
        credits: 14,
        password: await bcrypt.hash("180dc1964", 10),
        logo: oedc,
      },
      {
        name: "DESIGNERS-CONSORTIUM",
        username: "DC_SCIEnT",
        credits: 14,
        password: await bcrypt.hash("designersconsortium1964", 10),
        logo: dc,
      },
      {
        name: "NAKSHATRA",
        username: "NAKSHATRA_SCIEnT",
        credits: 14,
        password: await bcrypt.hash("nakshatra1964", 10),
        logo: naksh,
      },
      {
        name: "PSI",
        username: "PSI_SCIEnT",
        credits: 14,
        password: await bcrypt.hash("psi1964", 10),
        logo: psi,
      },
      {
        name: "RMI",
        username: "RMI_SCIEnT",
        credits: 14,
        password: await bcrypt.hash("rmi1964", 10),
        logo: rmi,
      },
      {
        name: "GRAPHIQUE",
        username: "GRAPHIQUE_SCIEnT",
        credits: 14,
        password: await bcrypt.hash("graphique1964", 10),
        logo: graphique,
      },
      {
        name: "3D-AERODYNAMICS",
        username: "3D_SCIEnT",
        credits: 14,
        password: await bcrypt.hash("3daerodynamics1964", 10),
        logo: td,
      },
      {
        name: "PROFNITT",
        username: "PROFNITT_SCIEnT",
        credits: 14,
        password: await bcrypt.hash("profnitt1964", 10),
        logo: prof,
      },
      {
        name: "FORCE-HYPERLOOP",
        username: "FH_SCIEnT",
        credits: 14,
        password: await bcrypt.hash("forcehyperloop1964", 10),
        logo: fh,
      },
      {
        name: "DATA-BYTE",
        username: "DATABYTE_SCIEnT",
        credits: 14,
        password: await bcrypt.hash("databyte1964", 10),
        logo: db,
      },
      {
        name: "EVER",
        username: "EVER_SCIEnT",
        credits: 14,
        password: await bcrypt.hash("ever1964", 10),
        logo: ever,
      },
      {
        name: "SCIEnT",
        username: "SCIEnT_SCIEnT",
        credits: 100,
        password: await bcrypt.hash("scient1964", 10),
        logo: scient,
        isAdmin: true,
      },
    ];

    // Delete existing clubs (optional)
    await Club.deleteMany({}); // Remove all clubs for a clean slate

    // Insert the clubs into the database
    await Club.insertMany(clubsData);

    res.status(201).send({ message: "Clubs seeded successfully!" });
  } catch (error) {
    console.error("Seeding error:", error);
    res.status(500).send({ message: "Error seeding clubs" });
  }
};
