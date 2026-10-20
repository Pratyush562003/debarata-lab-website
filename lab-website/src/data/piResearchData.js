export const defaultPiResearchData = {
  researchStatement: {
    overview: "My past research interest was on biomaterials (inorganic/polymer based) for bioimaging and cancer cell treatment. I have gained extensive experience in the design of inorganic/polymer-based biomaterials and hydrogels for tumor therapy and in vivo imaging including gamma, photoacoustic, IVIS, SPECT/CT, and MRI. I have deeply analyzed the tumor microenvironment (TME) to treat cancer through designed biomaterials, with a majority of research focused on X-ray radiation and photodynamic therapy.",
    currentFocus: "Currently, I am focusing on the suppression of immune response of polyethylene glycol (PEG). The research is centered on the interaction between anti-PEG antibodies and PEG. Meanwhile, I am also developing novel immunoassay kits and improving immunoassay protocols.",
    futureInterests: [
      "To improve immunotherapy efficacy of cancer treatment.",
      "Chemoimmunotherapy in Alzheimer’s Diseases: Exploring a cutting-edge therapy.",
      "To construct low-cost smart immunoassay kits."
    ]
  },

  skills: [
    "Biological applications including cancer cell imaging (in vitro & in vivo)",
    "Cancer therapy & immunogenicity studies",
    "Cell culture & confocal fluorescence microscopy",
    "Flow cytometry, ELISA & BLI (Bio-Layer Interferometry / SPR)",
    "Protein-polymer bioconjugation & interaction analysis (1H NMR)",
    "Inorganic biomaterials synthesis (solvothermal, sonochemical, hydrothermal)",
    "Materials characterization (XRD, TEM, SEM, UV-Vis, XPS, Raman spectroscopy)",
    "Polymer synthesis via Ring Opening Polymerization (ROP)",
    "Macromolecular characterization (1H NMR, GPC, FTIR, DLS)"
  ],

  researchExperience: [
    {
      id: "exp-1",
      role: "Postdoctoral Fellow – Research Assistant Professor",
      institution: "The Jikei University, School of Medicine",
      location: "Tokyo, Japan",
      period: "October 2021 – March 2023, April 2023 – August 2025",
      field: "Immunology & Biomaterials",
      details: [
        "Polymer: Investigating interaction between anti-PEG antibodies and polyethylene glycol (PEG).",
        "Developing inorganic nanoparticles-based immunoassay kits.",
        "Synthesizing PEG-polypeptoid block copolymers for stealth nanomedicine."
      ]
    },
    {
      id: "exp-2",
      role: "JSPS Postdoctoral Fellow",
      institution: "The University of Tokyo, Department of Material Engineering",
      location: "Tokyo, Japan",
      period: "July 2019 – July 2021",
      field: "Cancer Cell Therapy & Nanomedicine",
      details: [
        "Designing scintillating inorganic nanoparticles-loaded polymer capsules.",
        "X-ray induced photodynamic (PDT) cancer therapy.",
        "In vivo and in vitro evaluation of tumor microenvironment targeting."
      ]
    },
    {
      id: "exp-3",
      role: "Postdoctoral Fellow",
      institution: "Soochow University (FUNSOM)",
      location: "Suzhou, China",
      period: "November 2016 – May 2019",
      field: "Cancer Cell Therapy & Multimodal Imaging",
      details: [
        "Designing inorganic nanoparticles and stimuli-responsive polymeric hydrogels.",
        "Cancer therapy and multimodal imaging: In vitro and in vivo (SPECT/CT, MRI, photoacoustic).",
        "Development of radioisotope cancer therapy sensitized by coordination polymers."
      ]
    }
  ],

  publications: [
    // ── Immunology Papers ──
    {
      id: "pub-1",
      title: "Effect of hydrophilicity on PEG in PEGylated protein for suppression of anti-PEG antibody binding",
      authors: "Debabrata Maiti, M. Yokoyama, Kouichi Shiraishi",
      journal: "Bioconjugate Chemistry",
      year: "2024",
      category: "Immunology",
      highlight: "In Press",
      doi: ""
    },
    {
      id: "pub-2",
      title: "Rapid detection and quantification of serum anti-PEG antibody",
      authors: "Debabrata Maiti, M. Yokoyama, Kouichi Shiraishi",
      journal: "Nano Letters",
      year: "2024",
      category: "Immunology",
      highlight: "In Press",
      doi: ""
    },
    {
      id: "pub-3",
      title: "Impact of the Hydrophilicity of Poly(sarcosine) on Polyethylene Glycol (PEG) for the Suppression of Anti-PEG Antibody Binding",
      authors: "Debabrata Maiti, M. Yokoyama, Kouichi Shiraishi",
      journal: "ACS Omega",
      year: "2024",
      volume: "9, 32, 34577",
      category: "Immunology",
      highlight: "Journal Front Cover 🌟",
      doi: "10.1021/acsomega.4c03889"
    },
    {
      id: "pub-4",
      title: "PEG with dynamic nature in Micelle for suppression of anti-PEG antibody binding",
      authors: "Debabrata Maiti, M. Yokoyama, Kouichi Shiraishi",
      journal: "Biomaterials",
      year: "2024",
      category: "Immunology",
      highlight: "In Press",
      doi: ""
    },

    // ── Imaging Papers ──
    {
      id: "pub-5",
      title: "Design of Water-Soluble Rotaxane Capped Superparamagnetic Ultrasmall Fe3O4 Nanoparticles for Targeted NIR Fluorescence Imaging in Combination with Magnetic Resonance Imaging",
      authors: "Rabi Das, Debabrata Maiti, Samiran Kar, Tapas Bera, Ayan Mukherjee, Pranab Saha, Aniruddha Mondal, Samit Guha",
      journal: "Journal of the American Chemical Society (JACS)",
      year: "2023",
      volume: "145, 37, 20451–20461",
      category: "Imaging",
      highlight: "JACS Publication",
      doi: "10.1021/jacs.3c05988"
    },
    {
      id: "pub-6",
      title: "T1/T2-weighted magnetic resonance imaging and SPECT imaging guided combined radioisotope therapy and chemotherapy using functionalized reduced graphene oxide-manganese ferrite",
      authors: "R. Qian, Debabrata Maiti, J. Zhong, S. Xiong, H. Zhou, R. Zhu, J. Wan, K. Yang",
      journal: "Carbon",
      year: "2019",
      volume: "149, 55–62",
      category: "Imaging",
      highlight: "First Co-Author",
      doi: "10.1016/j.carbon.2019.04.032"
    },

    // ── PDT Cancer Therapy Papers ──
    {
      id: "pub-7",
      title: "Dual porphyrin photosensitizer loaded NaYF4:Eu Scintillating NPs for trimodal imaging guided hypoxia relieving tumor therapy under low X-ray dose",
      authors: "Debabrata Maiti, Y. Yu, M. Naito, K. Miyata, S. Yamashita, H. J. Kim",
      journal: "ChemBioChem",
      year: "2024",
      volume: "e202400838",
      category: "PDT Cancer Therapy",
      highlight: "Hot Topic: Cancer",
      doi: "10.1002/cbic.202400838"
    },
    {
      id: "pub-8",
      title: "Rose Bengal Decorated NaYF4:Tb Nanoparticles for Low Dose X-ray Induced Photodynamic Therapy in Cancer Cells",
      authors: "Debabrata Maiti, Y. Yu, H. J. Kim, K. Miyata",
      journal: "ACS Applied Bio Materials",
      year: "2022",
      volume: "5, 11, 5477–5486",
      category: "PDT Cancer Therapy",
      highlight: "",
      doi: "10.1021/acsabm.2c00768"
    },
    {
      id: "pub-9",
      title: "Terbium-rose bengal coordination nanocrystal induced ROS production under low dose X-ray in cultured cancer cells for photodynamic therapy",
      authors: "Debabrata Maiti, H. Yu, Y. Mochida, S. Won, S. Yamashita, M. Naito, K. Miyata, H. J. Kim",
      journal: "ACS Applied Bio Materials",
      year: "2023",
      volume: "6, 6, 2505–2513",
      category: "PDT Cancer Therapy",
      highlight: "",
      doi: "10.1021/acsabm.3c00282"
    },
    {
      id: "pub-10",
      title: "Polyoxomolybdate (POM) nanoclusters with radiosensitizing and scintillating properties for low dose X-ray inducible radiation-radiodynamic therapy",
      authors: "Debabrata Maiti, J. Zhong, Z. Zhang, H. Zhou, S. Xiong, Z. Dong, S. Kumar, Z. Liu, K. Yang",
      journal: "Nanoscale Horizons",
      year: "2020",
      volume: "5, 109–118",
      category: "PDT Cancer Therapy",
      highlight: "Nanoscale Horizons",
      doi: "10.1039/C9NH00569A"
    },

    // ── Radiation Therapy Papers ──
    {
      id: "pub-11",
      title: "Biomimetic Copper Sulfide for Chemo-Radiotherapy: Enhanced Uptake and Reduced Efflux of Nanoparticles for Tumor Cells under Ionizing Radiation",
      authors: "X. Yi, L. Chen, J. Chen, Debabrata Maiti, Z. Chai, Z. Liu, K. Yang",
      journal: "Advanced Functional Materials",
      year: "2017",
      volume: "27, 1705161",
      category: "Radiation Therapy",
      highlight: "Adv. Funct. Mater.",
      doi: "10.1002/adfm.201705161"
    },
    {
      id: "pub-12",
      title: "Highly Effective Radioisotope Cancer Therapy with a Non-therapeutic Isotope Delivered & Sensitized by Nanoscale Coordination Polymers",
      authors: "Y. Chao, L. Chao, Y. Yu, Debabrata Maiti, K. Yang, Zhuang Liu",
      journal: "ACS Nano",
      year: "2018",
      volume: "12, 8, 7519–7528",
      category: "Radiation Therapy",
      highlight: "ACS Nano",
      doi: "10.1021/acsnano.8b02444"
    },
    {
      id: "pub-13",
      title: "Development of thermosensitive protein conjugated nanogel for enhanced radio-chemo therapy of cancer",
      authors: "Debabrata Maiti, Y. Chao, Z. Dong, X. Yi, J. He, Zhuang Liu, K. Yang",
      journal: "Nanoscale",
      year: "2018",
      volume: "10, 13976–13985",
      category: "Radiation Therapy",
      highlight: "2018 Nanoscale Hot Article Collection",
      doi: "10.1039/C8NR03936A"
    },
    {
      id: "pub-14",
      title: "Holo-Lactoferrin Modified Liposome for Relieving Tumor Hypoxia and Enhancing Radiochemotherapy of Cancer",
      authors: "Zheng Zhang, Jingrong Yang, Qingqing Min, Chenjie Ling, Debabrata Maiti, Jiaying Xu, Liqiang Qin, Kai Yang",
      journal: "Small",
      year: "2019",
      volume: "15(6): 1803703",
      category: "Radiation Therapy",
      highlight: "Small",
      doi: "10.1002/smll.201803703"
    },

    // ── Review Article ──
    {
      id: "pub-15",
      title: "Carbon Based Nanomaterials for Biomedical Applications: A Recent Study",
      authors: "Debabrata Maiti, K. Yang",
      journal: "Frontiers in Pharmacology",
      year: "2019",
      volume: "9, 1421",
      category: "Review Article",
      highlight: "Review Article",
      doi: "10.3389/fphar.2018.01421"
    },

    // ── Material Chemistry Papers ──
    {
      id: "pub-16",
      title: "Phase Evolution and Growth of Iron Oxide Nanoparticles: Effect of Hydrazine Addition during Sonication",
      authors: "Debabrata Maiti, U. Manju, V. Srihari, P. Sujatha Devi",
      journal: "Crystal Growth & Design",
      year: "2013",
      volume: "13, 3637–3644",
      category: "Material Chemistry",
      highlight: "",
      doi: "10.1021/cg400618m"
    },
    {
      id: "pub-17",
      title: "Electrochemical Performance of Hematite Nanoparticles Derived from Spherical Maghemite and Elongated Goethite Particles",
      authors: "Debabrata Maiti, V. Aravindan, S. Madhavi, P. Sujatha Devi",
      journal: "Journal of Power Sources",
      year: "2014",
      volume: "276, 291–298",
      category: "Material Chemistry",
      highlight: "",
      doi: "10.1016/j.jpowsour.2014.11.127"
    },
    {
      id: "pub-18",
      title: "Selective Formation of Iron Oxide and Oxy-hydroxide Nanoparticles at Room Temperature: Critical Role of Concentration of Ferric Nitrate",
      authors: "Debabrata Maiti, P. Sujatha Devi",
      journal: "Materials Chemistry and Physics",
      year: "2015",
      volume: "154, 144–151",
      category: "Material Chemistry",
      highlight: "",
      doi: "10.1016/j.matchemphys.2015.01.056"
    },
    {
      id: "pub-19",
      title: "A Multifunctional Nanocomposite of Magnetic γ-Fe2O3 and Mesoporous Fluorescent ZnO",
      authors: "Debabrata Maiti, S. Mukhopadhyay, S. C. Mohanta, A. Saha, P. Sujatha Devi",
      journal: "Journal of Alloys and Compounds",
      year: "2015",
      volume: "653, 187–194",
      category: "Material Chemistry",
      highlight: "",
      doi: "10.1016/j.jallcom.2015.08.270"
    },
    {
      id: "pub-20",
      title: "Surface Modified Multifunctional ZnFe2O4 Nanoparticles for Hydrophobic and Hydrophilic Anti-Cancer Drug Molecule Loading",
      authors: "Debabrata Maiti, A. Saha, P. Sujatha Devi",
      journal: "Physical Chemistry Chemical Physics (PCCP)",
      year: "2016",
      volume: "18, 1439–1450",
      category: "Material Chemistry",
      highlight: "",
      doi: "10.1039/C5CP06338D"
    },
    {
      id: "pub-21",
      title: "Design and application of Au decorated ZnO/TiO2 as a stable photocatalyst for wide spectral coverage",
      authors: "S. Mukhopadhyay, Debabrata Maiti, S. Chatterjee, P. Sujatha Devi, Gopinatha Suresh Kumar",
      journal: "Physical Chemistry Chemical Physics (PCCP)",
      year: "2016",
      volume: "18, 31622–31633",
      category: "Material Chemistry",
      highlight: "",
      doi: "10.1039/C6CP06144J"
    },
    {
      id: "pub-22",
      title: "Shape transition of TiO2 nanocube to nanospindle embedded on reduced graphene oxide with enhanced photocatalytic activity",
      authors: "S. Mukhopadhyay, Debabrata Maiti, A. Saha, P. Sujatha Devi",
      journal: "Crystal Growth & Design",
      year: "2016",
      volume: "12, 6922–6932",
      category: "Material Chemistry",
      highlight: "",
      doi: "10.1021/acs.cgd.6b01138"
    },
    {
      id: "pub-23",
      title: "Evaluation of Mechanism on Selective, Rapid, and Superior Adsorption of Congo Red by Reusable Mesoporous α-Fe2O3 Nanorods",
      authors: "Debabrata Maiti, S. Mukhopadhyay, P. Sujatha Devi",
      journal: "ACS Sustainable Chemistry & Engineering",
      year: "2017",
      volume: "12, 11255–11267",
      category: "Material Chemistry",
      highlight: "",
      doi: "10.1021/acssuschemeng.7b02715"
    },
    {
      id: "pub-24",
      title: "Shape dependent biological property of Fe3O4 towards carrying anticancer drug",
      authors: "Debabrata Maiti, A. Saha, P. Sujatha Devi",
      journal: "Biointerfaces",
      year: "2024",
      volume: "In Press",
      category: "Material Chemistry",
      highlight: "In Press",
      doi: ""
    }
  ]
}
