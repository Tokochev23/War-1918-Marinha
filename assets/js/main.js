// assets/js/main.js

// --- CONFIGURAÇÃO DAS PLANILHAS DO GOOGLE SHEETS ---
const COUNTRY_STATS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR5Pw3aRXSTIGMglyNAUNqLtOl7wjX9bMeFXEASkQYC34g_zDyDx3LE8Vm73FUoNn27UAlKLizQBXBO/pub?gid=0&single=true&output=csv';
const NAVAL_CAPACITY_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR5Pw3aRXSTIGMglyNAUNqLtOl7wjX9bMeFXEASkQYC34g_zDyDx3LE8Vm73FUoNn27UAlKLizQBXBO/pub?gid=580175793&single=true&output=csv';

// --- DADOS DO JOGO - NAVIOS ---
const shipData = {
    countries: {},
    doctrines: {
        decisive_battle: { 
            name: "Batalha Decisiva", 
            description: "Foco em encouraçados poderosos para confrontos decisivos. Prioriza poder de fogo e proteção.", 
            cost_modifier: 1.20, 
            construction_time_modifier: 1.10,
            performance_bonus: { firepower: 1.15, armor: 1.10 }, 
            reliability_modifier: 0.95,
            preferred_ships: ['battleship', 'battle_cruiser']
        },
        convoy_warfare: { 
            name: "Guerra de Comboios", 
            description: "Proteção de rotas comerciais com destroyers e escoltas. Foco em números e eficiência.", 
            cost_modifier: 0.90, 
            construction_time_modifier: 0.85,
            performance_bonus: { asw: 1.20, range: 1.10 }, 
            reliability_modifier: 1.10,
            preferred_ships: ['destroyer', 'light_cruiser', 'escort_carrier']
        },
        power_projection: { 
            name: "Poder de Projeção", 
            description: "Porta-aviões como centro da frota. Domínio através do poder aéreo.", 
            cost_modifier: 1.25, 
            construction_time_modifier: 1.15,
            performance_bonus: { aircraft_ops: 1.20, aa: 1.10 }, 
            reliability_modifier: 0.90,
            preferred_ships: ['fleet_carrier', 'escort_carrier', 'light_cruiser']
        },
        submarine_warfare: { 
            name: "Guerra Submarina", 
            description: "Submarinos para interdição e ataque furtivo. Foco em stealth e torpedos.", 
            cost_modifier: 0.95, 
            construction_time_modifier: 0.90,
            performance_bonus: { torpedo: 1.15, stealth: 1.25 }, 
            reliability_modifier: 0.85,
            preferred_ships: ['submarine']
        },
        fleet_in_being: { 
            name: "Frota em Potencial", 
            description: "Manter uma frota poderosa como dissuasão. Equilíbrio entre todas as classes.", 
            cost_modifier: 1.10, 
            construction_time_modifier: 1.00,
            performance_bonus: { all: 1.05 }, 
            reliability_modifier: 1.05,
            preferred_ships: ['all']
        },
        commerce_raiding: { 
            name: "Guerra ao Comércio", 
            description: "Cruzadores rápidos para atacar navios mercantes. Velocidade sobre proteção.", 
            cost_modifier: 1.00, 
            construction_time_modifier: 0.95,
            performance_bonus: { speed: 1.15, range: 1.20 }, 
            reliability_modifier: 0.95,
            preferred_ships: ['heavy_cruiser', 'light_cruiser', 'submarine']
        }
    },
    components: {
        hulls: {
            submarine: { 
                name: "Submarino", 
                cost: 35550, 
                tonnage: 600, 
                base_speed: 15,
                crew: 35,
                construction_time: 2, // turnos base
                max_main_gun: 105,
                max_aircraft: 0,
                description: "Navio furtivo para ataques com torpedos. Vulnerável na superfície."
            },
            destroyer: { 
                name: "Destroyer", 
                cost: 59250, 
                tonnage: 750, 
                base_speed: 30,
                crew: 150,
                construction_time: 3,
                max_main_gun: 130,
                max_aircraft: 0,
                description: "Escolta versátil. Rápido e ágil, ideal contra submarinos."
            },
            light_cruiser: { 
                name: "Cruzador Leve", 
                cost: 118500, 
                tonnage: 1750, 
                base_speed: 28,
                crew: 400,
                construction_time: 4,
                max_main_gun: 155,
                max_aircraft: 2,
                description: "Navio de múltiplos propósitos. Bom equilíbrio entre velocidade e poder de fogo."
            },
            heavy_cruiser: { 
                name: "Cruzador Pesado", 
                cost: 237000, 
                tonnage: 3000, 
                base_speed: 25,
                crew: 700,
                construction_time: 5,
                max_main_gun: 203,
                max_aircraft: 3,
                description: "Poder de fogo considerável com boa proteção. Mais lento que cruzadores leves."
            },
            battle_cruiser: { 
                name: "Cruzador de Batalha", 
                cost: 355500, 
                tonnage: 4500, 
                base_speed: 27,
                crew: 1200,
                construction_time: 6,
                max_main_gun: 380,
                max_aircraft: 3,
                description: "Velocidade de cruzador com armas de encouraçado. Proteção sacrificada."
            },
            battleship: { 
                name: "Encouraçado", 
                cost: 474000, 
                tonnage: 9000, 
                base_speed: 21,
                crew: 1500,
                construction_time: 8,
                max_main_gun: 460,
                max_aircraft: 3,
                description: "Máximo poder de fogo e proteção. Lento mas devastador."
            },
            escort_carrier: { 
                name: "Porta-Aviões de Escolta", 
                cost: 316000, 
                tonnage: 6000, 
                base_speed: 18,
                crew: 800,
                construction_time: 5,
                max_main_gun: 130,
                max_aircraft: 30,
                description: "Porta-aviões leve para proteção de comboios. Capacidade limitada."
            },
            fleet_carrier: { 
                name: "Porta-Aviões de Esquadra", 
                cost: 1066500, 
                tonnage: 12000, 
                base_speed: 30,
                crew: 2500,
                construction_time: 10,
                max_main_gun: 130,
                max_aircraft: 90,
                description: "Plataforma aérea principal da frota. Alto custo mas capacidade incomparável."
            }
        },
        engines: {
            steam_turbine: { 
                name: "Turbina a Vapor", 
                cost: 0, 
                tonnage: 0, 
                speed_base: 25,
                reliability: 1.0,
                range_modifier: 1.0,
                description: "Propulsão padrão. Confiável e eficiente."
            },
            steam_engine: { 
                name: "Motor a Vapor", 
                cost: -5000, 
                tonnage: -50, 
                speed_base: 20,
                reliability: 1.1,
                range_modifier: 0.8,
                description: "Tecnologia mais antiga. Mais barato mas menos eficiente."
            },
            diesel: { 
                name: "Motor a Diesel", 
                cost: 8000, 
                tonnage: 80, 
                speed_base: 24,
                reliability: 1.05,
                range_modifier: 1.5,
                description: "Melhor alcance. Ideal para submarinos e navios de patrulha."
            },
            diesel_electric: { 
                name: "Motor Eletro-diesel", 
                cost: 15000, 
                tonnage: 120, 
                speed_base: 30,
                reliability: 0.95,
                range_modifier: 1.3,
                description: "Híbrido eficiente. Silencioso submerso (submarinos)."
            },
            gas_turbine: { 
                name: "Turbina a Gás", 
                cost: 2431344, 
                tonnage: 504, 
                speed_base: 35,
                reliability: 0.85,
                range_modifier: 0.7,
                description: "Alta velocidade mas alto consumo. Tecnologia experimental."
            }
        },
        propellers: {
            single: { 
                name: "Hélice Única", 
                cost: 0, 
                tonnage: 0,
                speed_modifier: 1.0,
                maneuverability: 0.8,
                description: "Configuração básica. Menos manobrável."
            },
            double: { 
                name: "Hélices Duplas", 
                cost: 200000, 
                tonnage: 100,
                speed_modifier: 1.1,
                maneuverability: 1.0,
                description: "Padrão para navios maiores. Boa manobrabilidade."
            },
            triple: { 
                name: "Hélices Triplas", 
                cost: 300000, 
                tonnage: 120,
                speed_modifier: 1.15,
                maneuverability: 1.1,
                description: "Para navios rápidos. Excelente aceleração."
            },
            quadruple: { 
                name: "Hélices Quádruplas", 
                cost: 400000, 
                tonnage: 140,
                speed_modifier: 1.2,
                maneuverability: 1.05,
                description: "Máxima potência. Necessário para grandes navios."
            },
            counter_rotating: { 
                name: "Hélice Contra-Rotativa", 
                cost: 1500000, 
                tonnage: 120,
                speed_modifier: 1.25,
                maneuverability: 0.9,
                description: "Experimental. Máxima eficiência mas complexo."
            }
        },
        steering: {
            manual: { 
                name: "Manual", 
                cost: 0, 
                tonnage: 0,
                maneuverability_mod: 0.7,
                description: "Direção manual básica. Resposta lenta."
            },
            steam: { 
                name: "Direção a Vapor", 
                cost: 150000, 
                tonnage: 100,
                maneuverability_mod: 1.0,
                description: "Assistência a vapor. Padrão para navios grandes."
            },
            hydraulic: { 
                name: "Direção Hidráulica", 
                cost: 50000, 
                tonnage: 80,
                maneuverability_mod: 1.1,
                description: "Resposta rápida. Ideal para destroyers."
            },
            electro_hydraulic: { 
                name: "Direção Eletro-Hidráulica", 
                cost: 350000, 
                tonnage: 100,
                maneuverability_mod: 1.2,
                description: "Controle preciso. Melhor para combate."
            },
            electric: { 
                name: "Direção Elétrica", 
                cost: 400000, 
                tonnage: 40,
                maneuverability_mod: 1.15,
                description: "Leve e responsivo. Tecnologia avançada."
            }
        },
        armaments: {
            aa_20mm: { name: "Canhões AA 20mm", cost: 25000, tonnage: 1 },
            aa_37mm: { name: "Canhões AA 37mm", cost: 40000, tonnage: 2 },
            aa_40mm: { name: "Canhões AA 40mm", cost: 150000, tonnage: 5 },
            hybrid_90mm: { name: "Híbridos 90mm", cost: 75000, tonnage: 12 },
            hybrid_127mm: { name: "Híbridos 127mm", cost: 100000, tonnage: 18 },
            secondary_152mm: { name: "Secundários 152mm", cost: 137000, tonnage: 20 },
            torpedo_433mm: { name: "Torpedos 433mm", cost: 125000, tonnage: 1 },
            torpedo_533mm: { name: "Torpedos 533mm", cost: 175000, tonnage: 2 },
            torpedo_633mm: { name: "Torpedos 633mm", cost: 250000, tonnage: 3 },
            torpedo_710mm: { name: "Torpedos 710mm", cost: 400000, tonnage: 4 },
            depth_charge: { name: "Carga de Profundidade", cost: 225000, tonnage: 2 }
        },
        armor: {
            none: { 
                name: "Sem Blindagem", 
                cost_per_mm: 0, 
                tonnage_per_mm: 0,
                effectiveness: 0,
                description: "Nenhuma proteção adicional."
            },
            harvey: { 
                name: "Harvey", 
                cost_per_mm: 1500, 
                tonnage_per_mm: 2,
                effectiveness: 0.8,
                description: "Blindagem cimentada inicial. Obsoleta mas barata."
            },
            krupp: { 
                name: "Krupp", 
                cost_per_mm: 2000, 
                tonnage_per_mm: 2.5,
                effectiveness: 1.0,
                description: "Aço de alta qualidade. Padrão do período."
            },
            kca: { 
                name: "KCA (Aço Krupp Cimentado)", 
                cost_per_mm: 2500, 
                tonnage_per_mm: 3,
                effectiveness: 1.2,
                description: "Melhor proteção disponível. Face endurecida."
            },
            homogeneous: { 
                name: "Homogênea", 
                cost_per_mm: 2250, 
                tonnage_per_mm: 3,
                effectiveness: 1.1,
                description: "Aço uniforme. Boa contra projéteis AP."
            },
            ducol: { 
                name: "Aço Ducol", 
                cost_per_mm: 3000, 
                tonnage_per_mm: 2.8,
                effectiveness: 1.15,
                description: "Liga especial britânica. Leve e resistente."
            }
        },
        equipment: {
            torpedo_protection: { name: "Proteção Anti-Torpedo", cost: 750000, tonnage: 150, reliability_mod: 1.1 },
            flooding_protection: { name: "Proteção contra Alagamento", cost: 450000, tonnage: 100, reliability_mod: 1.15 },
            fire_protection: { name: "Proteção Contra Incêndios", cost: 450000, tonnage: 60, reliability_mod: 1.1 },
            crew_protection: { name: "Equipamentos de Proteção da Tripulação", cost: 300000, tonnage: 50, reliability_mod: 1.05 },
            tungsten_ammo: { name: "Munição de Tungstênio", cost: 1500000, tonnage: 10, firepower_mod: 1.15 },
            aircraft_catapult: { name: "Catapulta para Aviões", cost: 750000, tonnage: 30 },
            electric_turrets: { name: "Motor Elétrico para Torretas", cost: 450000, tonnage: 15, firepower_mod: 1.1 },
            rangefinder: { name: "Rangefinder/Telêmetro", cost: 400000, tonnage: 5, firepower_mod: 1.05 },
            telegraph: { name: "Telégrafo", cost: 155000, tonnage: 3 },
            radar: { name: "Radar", cost: 1050000, tonnage: 15, aa_mod: 1.2, detection_mod: 1.5 },
            advanced_fire_control: { name: "Radar de Controle de Fogo Avançado", cost: 2250000, tonnage: 500, firepower_mod: 1.25, aa_mod: 1.3 },
            radio: { name: "Rádio", cost: 150000, tonnage: 300 },
            ecm: { name: "Sistemas ECM", cost: 3375000, tonnage: 500, detection_mod: 0.7 },
            sonar: { name: "Sonar Passivo/Ativo", cost: 1050000, tonnage: 300, asw_mod: 1.5 },
            cryptography: { name: "Sistemas de Criptografia", cost: 450000, tonnage: 250 },
            towed_sonar: { name: "Sonar de Arrasto", cost: 325000, tonnage: 300, asw_mod: 1.3 },
            minesweeping: { name: "Equipamento de Desminagem", cost: 80000, tonnage: 10 },
            mines: { name: "Minas Navais", cost: 450000, tonnage: 2 },
            computerized_fire_control: { name: "Sistemas de Mira Computadorizados", cost: 2250000, tonnage: 30, firepower_mod: 1.3 }
        }
    },
    constants: {
        main_gun_cost_per_mm: 900, // Custo por mm de calibre
        main_gun_tonnage_per_mm: 0.1, // Tonelagem por mm
        base_construction_turns: {
            submarine: 2,
            destroyer: 3,
            light_cruiser: 4,
            heavy_cruiser: 5,
            battle_cruiser: 6,
            battleship: 8,
            escort_carrier: 5,
            fleet_carrier: 10
        },
        country_cost_reduction_factor: 0.20,
        max_tech_naval_level: 100,
    }
};

// Dados de navios históricos para referência de imagem
const historicalShips = [
    { id: 'bismarck', name: 'Bismarck', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Bundesarchiv_Bild_193-04-1-26%2C_Schlachtschiff_Bismarck.jpg/800px-Bundesarchiv_Bild_193-04-1-26%2C_Schlachtschiff_Bismarck.jpg' },
    { id: 'hood', name: 'HMS Hood', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/HMS_Hood_%2851%29_-_March_17%2C_1924.jpg/800px-HMS_Hood_%2851%29_-_March_17%2C_1924.jpg' },
    { id: 'iowa', name: 'USS Iowa', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/USS_Iowa_%28BB-61%29_firing_broadside.jpg/800px-USS_Iowa_%28BB-61%29_firing_broadside.jpg' },
    { id: 'yamato', name: 'Yamato', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Yamato_Trial_1941.jpg/800px-Yamato_Trial_1941.jpg' },
    { id: 'enterprise', name: 'USS Enterprise', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/USS_Enterprise_%28CV-6%29_in_Puget_Sound%2C_September_1945.jpg/800px-USS_Enterprise_%28CV-6%29_in_Puget_Sound%2C_September_1945.jpg' },
    { id: 'ark_royal', name: 'HMS Ark Royal', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/HMS_Ark_Royal_h85716.jpg/800px-HMS_Ark_Royal_h85716.jpg' },
    { id: 'u47', name: 'U-47', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/U-47.jpg/800px-U-47.jpg' },
    { id: 'fletcher', name: 'USS Fletcher', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Fletcher_%28DD-445%29.jpg/800px-Fletcher_%28DD-445%29.jpg' }
];

// --- FUNÇÕES AUXILIARES ---

/**
 * Limpa e converte um valor de string para float.
 * Remove símbolos de moeda, pontos de milhar e vírgulas decimais.
 * @param {string|number} value - O valor a ser limpo e convertido.
 * @returns {number} O valor numérico.
 */
function cleanAndParseFloat(value) {
    if (typeof value !== 'string') return parseFloat(value) || 0;
    const cleanedValue = value.trim().replace('£', '').replace(/\./g, '').replace(',', '.').replace('%', '');
    return parseFloat(cleanedValue) || 0;
}

/**
 * Analisa um arquivo CSV de uma URL.
 * @param {string} url - A URL do arquivo CSV.
 * @returns {Promise<Array<Object>>} Uma promessa que resolve para um array de objetos, onde cada objeto é uma linha do CSV.
 */
async function parseCSV(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erro ao carregar CSV de ${url}: ${response.statusText}`);
        const csvText = await response.text();
        
        const lines = csvText.trim().split('\n').filter(line => line.trim() !== '');
        if (lines.length < 1) return [];

        // Função para dividir linhas CSV de forma robusta, lidando com vírgulas dentro de aspas
        const robustSplit = (str) => {
            return str.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => {
                let value = v.trim();
                if (value.startsWith('"') && value.endsWith('"')) value = value.substring(1, value.length - 1);
                return value.replace(/""/g, '"');
            });
        };

        const headers = robustSplit(lines[0]);
        
        return lines.slice(1).map(line => {
            const values = robustSplit(line);
            let row = {};
            headers.forEach((header, i) => { row[headers[i]] = values[i] || ''; });
            return row;
        });
    } catch (error) {
        console.error(`Erro na requisição de rede para ${url}:`, error);
        // Retorna um array vazio para evitar quebrar a aplicação se os dados não puderem ser carregados
        return []; 
    }
}

/**
 * Estima a tripulação com base no tipo de casco e tonelagem.
 * Esta função é compartilhada entre main.js e ship_sheet.html.
 * @param {string} hullType - O tipo de casco do navio.
 * @param {number} tonnage - A tonelagem final do navio.
 * @returns {number} O número estimado de tripulantes.
 */
function estimateCrew(hullType, tonnage) {
    const baseCrewMap = {
        'Submarino': 35,
        'Destroyer': 150,
        'Cruzador Leve': 400,
        'Cruzador Pesado': 700,
        'Cruzador de Batalha': 1200,
        'Encouraçado': 1500,
        'Porta-Aviões de Escolta': 800,
        'Porta-Aviões de Esquadra': 2500
    };
    const baseCrew = baseCrewMap[hullType] || 500;
    const tonnageModifier = tonnage / 5000; // Adiciona tripulação baseada no tamanho
    return Math.round(baseCrew * (1 + tonnageModifier * 0.2));
}

// --- CARREGAMENTO DE DADOS ---

/**
 * Carrega dados de países e capacidade naval das planilhas do Google Sheets.
 */
async function loadShipDataFromSheets() {
    const countryDropdown = document.getElementById('country_doctrine');
    countryDropdown.innerHTML = '<option value="loading">Carregando dados...</option>';
    countryDropdown.disabled = true;

    try {
        const [countryStatsRaw, navalCapacityRaw] = await Promise.all([
            parseCSV(COUNTRY_STATS_URL),
            parseCSV(NAVAL_CAPACITY_URL)
        ]);

        const tempCountries = {};
        
        // Dados gerais dos países
        countryStatsRaw.forEach(row => {
            const countryName = row['País'];
            if (countryName) {
                tempCountries[countryName] = {
                    tech_naval: cleanAndParseFloat(row['Marinha']) || 50,
                    production_capacity: 0
                };
            }
        });

        // Capacidade de produção naval
        navalCapacityRaw.forEach(row => {
            const countryName = row['País'];
            if (tempCountries[countryName]) {
                tempCountries[countryName].production_capacity = cleanAndParseFloat(row['Capacidade de produção']);
            }
        });
        
        // País genérico para fallback
        tempCountries["Genérico / Padrão"] = { 
            production_capacity: 100000000, 
            tech_naval: 50 
        };

        shipData.countries = tempCountries;
        populateCountryDropdown();
        countryDropdown.disabled = false;
        updateShipCalculations();

    } catch (error) {
        console.error("Erro ao carregar dados das planilhas:", error);
        // Fallback para dados genéricos se houver erro no carregamento
        shipData.countries = { 
            "Genérico / Padrão": { 
                production_capacity: 100000000, 
                tech_naval: 50 
            } 
        };
        populateCountryDropdown();
        countryDropdown.disabled = false;
        updateShipCalculations();
    }
}

/**
 * Popula o dropdown de países com os dados carregados.
 */
function populateCountryDropdown() {
    const dropdown = document.getElementById('country_doctrine');
    dropdown.innerHTML = '';
    const sortedCountries = Object.keys(shipData.countries).sort();
    sortedCountries.forEach(countryName => {
        const option = document.createElement('option');
        option.value = countryName;
        option.textContent = countryName;
        dropdown.appendChild(option);
    });
    // Define o país genérico como padrão se existir
    if (shipData.countries["Genérico / Padrão"]) {
        dropdown.value = "Genérico / Padrão";
    }
}

// --- FUNÇÃO PRINCIPAL DE CÁLCULO ---
/**
 * Atualiza todos os cálculos e exibições do navio com base nas entradas do usuário.
 * @returns {Object|null} Os dados calculados do navio ou null se o tipo de casco não for selecionado.
 */
function updateShipCalculations() {
    // --- Entradas do Usuário ---
    const shipName = document.getElementById('ship_name').value || 'Navio Sem Nome';
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    const selectedCountryName = document.getElementById('country_doctrine').value;
    const selectedNavalDoctrine = document.getElementById('naval_doctrine').value;
    const hullType = document.getElementById('hull_type').value;
    const engineType = document.getElementById('engine_type').value;
    const propellerConfig = document.getElementById('propeller_config').value;
    const steeringSystem = document.getElementById('steering_system').value;
    const mainGunCaliber = parseInt(document.getElementById('main_gun_caliber').value) || 0;
    const mainGunQuantity = parseInt(document.getElementById('main_gun_quantity').value) || 0;
    const armorType = document.getElementById('armor_type').value;
    const armorThickness = parseInt(document.getElementById('armor_thickness').value) || 0;
    const depthCharges = parseInt(document.getElementById('depth_charges').value) || 0;
    const aircraftCapacity = parseInt(document.getElementById('aircraft_capacity').value) || 0;
    const productionQualitySliderValue = parseInt(document.getElementById('production_quality_slider').value) || 50;

    // --- Variáveis de Cálculo ---
    let baseCost = 0, baseTonnage = 0;
    let costModifier = 1.0, tonnageModifier = 1.0, reliabilityModifier = 1.0;
    let constructionTimeModifier = 1.0;
    let performanceBonuses = { 
        speed: 1.0, 
        firepower: 1.0, 
        armor: 1.0, 
        aa: 1.0, 
        asw: 1.0, 
        range: 1.0,
        maneuverability: 1.0
    };
    
    // --- Processamento de País e Doutrina ---
    const doctrineData = shipData.doctrines[selectedNavalDoctrine];
    const countryData = shipData.countries[selectedCountryName];
    
    document.getElementById('doctrine_note').textContent = doctrineData ? doctrineData.description : "Selecione uma doutrina para ver seus efeitos.";
    
    let countryCostReduction = 0;
    let countryProductionCapacity = 0;
    if (countryData) {
        countryCostReduction = (countryData.tech_naval / shipData.constants.max_tech_naval_level) * shipData.constants.country_cost_reduction_factor;
        countryProductionCapacity = countryData.production_capacity;
        document.getElementById('country_bonus_note').textContent = `Bônus do País: Redução de Custo de ${(countryCostReduction * 100).toFixed(1)}%, Tecnologia Naval: ${countryData.tech_naval}.`;
    } else {
        document.getElementById('country_bonus_note').textContent = "Selecione um país para ver seus bônus.";
    }

    // --- Validação Inicial: Requer tipo de casco selecionado ---
    const hullData = shipData.components.hulls[hullType];
    if (!hullData) {
        document.getElementById('status').textContent = "Selecione o tipo de casco para começar.";
        document.getElementById('status').className = "status-indicator";
        // Limpa UI de resumo
        ['display_name', 'display_class', 'display_doctrine', 'unit_cost', 'total_production_cost', 'displacement', 'build_time', 'max_speed', 'range', 'effective_armor', 'firepower', 'aa_capability', 'asw_capability', 'reliability_display', 'max_allowed_cost'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                if (id === 'unit_cost' || id === 'total_production_cost' || id === 'max_allowed_cost') {
                    element.textContent = '£0';
                } else if (id === 'displacement') {
                    element.textContent = '0 ton';
                } else if (id === 'build_time') {
                    element.textContent = '0 turnos';
                } else if (id === 'max_speed') {
                    element.textContent = '0 nós';
                } else if (id === 'range') {
                    element.textContent = '0 milhas náuticas';
                } else if (id === 'effective_armor') {
                    element.textContent = '0 mm';
                } else if (id === 'reliability_display') {
                    element.textContent = '0%';
                } else if (id === 'display_name') {
                    element.textContent = 'Sem nome';
                } else if (id === 'display_class' || id === 'display_doctrine') {
                    element.textContent = '-';
                } else {
                    element.textContent = '0';
                }
            }
        });
        document.getElementById('total_cost_label').textContent = `Custo Total (1x):`;
        document.getElementById('construction_time').textContent = `Tempo total de construção: 0 turnos`;
        return null; // Sai da função se o casco não estiver selecionado
    }

    // --- Continua o Processamento se o casco estiver selecionado ---
    baseCost += hullData.cost;
    baseTonnage += hullData.tonnage;
    let baseConstructionTime = hullData.construction_time;
    
    document.getElementById('hull_type_note').textContent = hullData.description;
    
    // Aplica modificadores de doutrina
    if (doctrineData) {
        costModifier *= (doctrineData.cost_modifier || 1.0);
        constructionTimeModifier *= (doctrineData.construction_time_modifier || 1.0);
        reliabilityModifier *= (doctrineData.reliability_modifier || 1.0);
        
        if(doctrineData.performance_bonus) {
            for(const key in doctrineData.performance_bonus) {
                if(performanceBonuses.hasOwnProperty(key)) { // Garante que a propriedade existe
                    performanceBonuses[key] *= doctrineData.performance_bonus[key];
                }
            }
        }
        
        // Bônus se o navio é preferido pela doutrina
        if(doctrineData.preferred_ships.includes(hullType) || doctrineData.preferred_ships.includes('all')) {
            costModifier *= 0.95; // 5% de redução de custo
            constructionTimeModifier *= 0.90; // 10% de redução no tempo
        }
    }

    // Motor
    let baseSpeed = hullData.base_speed;
    if(engineType) {
        const engineData = shipData.components.engines[engineType];
        baseCost += engineData.cost;
        baseTonnage += engineData.tonnage;
        baseSpeed = engineData.speed_base;
        reliabilityModifier *= engineData.reliability;
        performanceBonuses.range *= engineData.range_modifier;
        document.getElementById('engine_note').textContent = engineData.description;
    } else {
        document.getElementById('engine_note').textContent = "Selecione um tipo de motor.";
    }

    // Hélices
    if (propellerConfig) {
        const propellerData = shipData.components.propellers[propellerConfig];
        baseCost += propellerData.cost;
        baseTonnage += propellerData.tonnage;
        baseSpeed *= propellerData.speed_modifier;
        performanceBonuses.maneuverability *= propellerData.maneuverability;
    }

    // Sistema de direção
    if (steeringSystem) {
        const steeringData = shipData.components.steering[steeringSystem];
        baseCost += steeringData.cost;
        baseTonnage += steeringData.tonnage;
        performanceBonuses.maneuverability *= steeringData.maneuverability_mod;
    }

    // Armamento principal
    if(mainGunCaliber > 0 && mainGunQuantity > 0) {
        if(mainGunCaliber > hullData.max_main_gun) {
            document.getElementById('main_gun_note').textContent = `Calibre máximo para ${hullData.name}: ${hullData.max_main_gun}mm. Ajustado para o máximo.`;
            // Ajusta o valor do input para o máximo permitido
            document.getElementById('main_gun_caliber').value = hullData.max_main_gun; 
            const adjustedCaliber = hullData.max_main_gun;
            const gunCost = adjustedCaliber * shipData.constants.main_gun_cost_per_mm * mainGunQuantity;
            const gunTonnage = adjustedCaliber * shipData.constants.main_gun_tonnage_per_mm * mainGunQuantity;
            baseCost += gunCost;
            baseTonnage += gunTonnage;
        } else {
            document.getElementById('main_gun_note').textContent = "";
            const gunCost = mainGunCaliber * shipData.constants.main_gun_cost_per_mm * mainGunQuantity;
            const gunTonnage = mainGunCaliber * shipData.constants.main_gun_tonnage_per_mm * mainGunQuantity;
            baseCost += gunCost;
            baseTonnage += gunTonnage;
        }
    } else {
        document.getElementById('main_gun_note').textContent = "";
    }

    // Armamento secundário e AA
    let totalAACapability = 0;
    let totalFirepower = mainGunCaliber * mainGunQuantity; // Começa com o poder de fogo principal
    
    const secondaryArmaments = ['aa_20mm', 'aa_37mm', 'aa_40mm', 'hybrid_90mm', 'hybrid_127mm', 'secondary_152mm'];
    secondaryArmaments.forEach(id => {
        const qty = parseInt(document.getElementById(id).value) || 0;
        if(qty > 0) {
            const armData = shipData.components.armaments[id];
            if (armData) { // Verifica se os dados do armamento existem
                baseCost += armData.cost * qty;
                baseTonnage += armData.tonnage * qty;
                
                // Calcula capacidade AA
                if(id.includes('aa_') || id.includes('hybrid_')) {
                    const caliber = parseInt(id.match(/\d+/)[0]);
                    totalAACapability += caliber * qty;
                }
                
                // Adiciona ao poder de fogo
                if(id.includes('hybrid_') || id.includes('secondary_')) {
                    const caliber = parseInt(id.match(/\d+/)[0]);
                    totalFirepower += (caliber * qty) * 0.5; // Secundários contam menos
                }
            }
        }
    });

    // Torpedos
    const torpedoTypes = ['torpedo_433mm', 'torpedo_533mm', 'torpedo_633mm', 'torpedo_710mm'];
    let totalTorpedoPower = 0; // Não usado no cálculo final do poder de fogo, mas pode ser útil para outras métricas
    torpedoTypes.forEach(id => {
        const qty = parseInt(document.getElementById(id).value) || 0;
        if(qty > 0) {
            const armData = shipData.components.armaments[id];
            if (armData) { // Verifica se os dados do armamento existem
                baseCost += armData.cost * qty;
                baseTonnage += armData.tonnage * qty;
                const caliber = parseInt(id.match(/\d+/)[0]);
                totalTorpedoPower += caliber * qty;
            }
        }
    });

    // Blindagem
    let effectiveArmor = 0;
    if(armorType !== 'none' && armorThickness > 0) {
        const armorData = shipData.components.armor[armorType];
        if (armorData) { // Verifica se os dados da blindagem existem
            baseCost += armorData.cost_per_mm * armorThickness;
            baseTonnage += armorData.tonnage_per_mm * armorThickness;
            effectiveArmor = armorThickness * armorData.effectiveness;
            document.getElementById('armor_note').textContent = armorData.description;
        }
    } else {
        document.getElementById('armor_note').textContent = "";
    }

    // Equipamentos
    let totalASWCapability = depthCharges * 10; // Base para capacidade ASW
    document.querySelectorAll('#equipment-section input:checked').forEach(cb => {
        const item = shipData.components.equipment[cb.id];
        if (item) { // Verifica se os dados do equipamento existem
            baseCost += item.cost;
            baseTonnage += item.tonnage;
            if(item.reliability_mod) reliabilityModifier *= item.reliability_mod;
            if(item.firepower_mod) performanceBonuses.firepower *= item.firepower_mod;
            if(item.aa_mod) performanceBonuses.aa *= item.aa_mod;
            if(item.asw_mod) performanceBonuses.asw *= item.asw_mod;
        }
    });

    // Cargas de profundidade
    if(depthCharges > 0) {
        const depthChargeData = shipData.components.armaments.depth_charge;
        if (depthChargeData) { // Verifica se os dados da carga de profundidade existem
            baseCost += depthChargeData.cost * depthCharges;
            baseTonnage += depthChargeData.tonnage * depthCharges;
        }
    }

    // Mostra/esconde seção de aeronaves para porta-aviões
    const aircraftSection = document.getElementById('aircraft-section');
    if(hullType === 'escort_carrier' || hullType === 'fleet_carrier') {
        aircraftSection.style.display = 'block';
        document.getElementById('aircraft_capacity').max = hullData.max_aircraft;
        // Garante que a capacidade de aeronaves não excede o máximo do casco
        if(aircraftCapacity > hullData.max_aircraft) {
            document.getElementById('aircraft_capacity').value = hullData.max_aircraft;
        }
        // Calcula o custo das aeronaves com base na capacidade máxima do casco
        // Assumindo um custo base de 900.000 para um porta-aviões de capacidade máxima
        // e distribuindo esse custo proporcionalmente pelas aeronaves selecionadas.
        // Se aircraftCapacity for 0, o custo de aeronaves será 0.
        if (hullData.max_aircraft > 0) {
            baseCost += aircraftCapacity * (900000 / hullData.max_aircraft);
        }
    } else {
        aircraftSection.style.display = 'none';
        document.getElementById('aircraft_capacity').value = 0; // Reseta a capacidade se não for porta-aviões
    }

    // Slider de qualidade vs produção
    // O slider varia de 0 a 100. 50 é o ponto neutro.
    // sliderValue será de -1 (0 no slider) a 1 (100 no slider).
    let sliderValue = (productionQualitySliderValue - 50) / 50; 
    
    // Modificadores baseados no slider
    // Se sliderValue for positivo (mais velocidade), confiabilidade diminui, custo aumenta, tempo diminui.
    // Se sliderValue for negativo (mais qualidade), confiabilidade aumenta, custo diminui, tempo aumenta.
    reliabilityModifier *= (1 + (sliderValue * 0.15)); // +/- 15% de confiabilidade
    baseCost *= (1 + (sliderValue * 0.20)); // +/- 20% de custo
    constructionTimeModifier *= (1 - (sliderValue * 0.30)); // +/- 30% de tempo

    document.getElementById('production_quality_note').textContent = 
        `Foco ${sliderValue > 0.1 ? 'em Velocidade (produção rápida)' : (sliderValue < -0.1 ? 'em Qualidade (produção lenta)' : 'Neutro')}: ` +
        `Confiabilidade ${sliderValue > 0.1 ? 'reduzida' : (sliderValue < -0.1 ? 'aumentada' : 'normal')} / ` +
        `Custo ${sliderValue > 0.1 ? 'aumentado' : (sliderValue < -0.1 ? 'reduzido' : 'normal')} / ` +
        `Tempo de construção ${sliderValue > 0.1 ? 'reduzido' : (sliderValue < -0.1 ? 'aumentado' : 'normal')}.`;


    // --- CÁLCULOS FINAIS ---
    
    // Custo e tonelagem finais
    const finalCost = Math.round(baseCost * costModifier * (1 - countryCostReduction));
    const finalTonnage = Math.round(baseTonnage * tonnageModifier);
    
    // Tempo de construção: Garante que o tempo mínimo seja 1 turno
    const finalConstructionTime = Math.max(1, Math.round(baseConstructionTime * constructionTimeModifier));
    
    // Velocidade: Penalidade de peso para navios muito pesados
    const speedPenaltyFromWeight = Math.max(0.5, 1 - (finalTonnage / (hullData.tonnage * 3))); // Penalidade máxima de 50%
    const finalSpeed = Math.round(baseSpeed * performanceBonuses.speed * speedPenaltyFromWeight);
    
    // Alcance: Baseado na tonelagem e modificador de alcance
    const baseRange = 1000 + (finalTonnage * 2); 
    const finalRange = Math.round(baseRange * performanceBonuses.range);
    
    // Capacidades de combate
    const finalFirepower = Math.round(totalFirepower * performanceBonuses.firepower);
    const finalAACapability = Math.round(totalAACapability * performanceBonuses.aa);
    const finalASWCapability = Math.round(totalASWCapability * performanceBonuses.asw);
    const finalEffectiveArmor = Math.round(effectiveArmor * performanceBonuses.armor);
    
    // Confiabilidade: Limites entre 50% e 100%
    const finalReliability = Math.max(50, Math.min(100, 100 * reliabilityModifier));

    // --- ATUALIZAÇÃO DA UI ---
    document.getElementById('display_name').textContent = shipName;
    document.getElementById('display_class').textContent = hullData.name;
    document.getElementById('display_doctrine').textContent = doctrineData ? doctrineData.name : '-';
    document.getElementById('unit_cost').textContent = `£${finalCost.toLocaleString('pt-BR')}`;
    document.getElementById('total_production_cost').textContent = `£${(finalCost * quantity).toLocaleString('pt-BR')}`;
    document.getElementById('displacement').textContent = `${finalTonnage.toLocaleString('pt-BR')} ton`;
    document.getElementById('build_time').textContent = `${finalConstructionTime} turnos (${finalConstructionTime * 6} meses)`;
    document.getElementById('max_speed').textContent = `${finalSpeed} nós`;
    document.getElementById('range').textContent = `${finalRange.toLocaleString('pt-BR')} milhas náuticas`;
    document.getElementById('effective_armor').textContent = `${finalEffectiveArmor} mm`;
    document.getElementById('firepower').textContent = finalFirepower.toLocaleString('pt-BR');
    document.getElementById('aa_capability').textContent = finalAACapability.toLocaleString('pt-BR');
    document.getElementById('asw_capability').textContent = finalASWCapability.toLocaleString('pt-BR');
    document.getElementById('reliability_display').textContent = `${finalReliability.toFixed(1)}%`;
    document.getElementById('max_allowed_cost').textContent = `£${countryProductionCapacity.toLocaleString('pt-BR')}`;
    
    document.getElementById('total_cost_label').textContent = `Custo Total (${quantity}x):`;
    document.getElementById('construction_time').textContent = `Tempo total de construção: ${finalConstructionTime} turnos`;
    
    // Status do projeto
    const statusEl = document.getElementById('status');
    const totalCost = finalCost * quantity;
    
    if(totalCost > countryProductionCapacity) {
        statusEl.textContent = "❌ Custo excede a capacidade de produção do país!";
        statusEl.className = "status-indicator status-error";
    } else if(finalReliability < 70) {
        statusEl.textContent = "⚠️ Confiabilidade baixa: Propenso a avarias!";
        statusEl.className = "status-indicator status-warning";
    } else if(finalSpeed < 15 && hullType !== 'submarine') { // Submarinos podem ser lentos por natureza
        statusEl.textContent = "⚠️ Navio muito lento para sua classe!";
        statusEl.className = "status-indicator status-warning";
    } else {
        statusEl.textContent = "✅ Projeto naval pronto! Clique no resumo para gerar a ficha.";
        statusEl.className = "status-indicator status-ok";
    }

    // Retorna dados para salvamento e ficha
    return {
        shipName, quantity, selectedCountryName, 
        doctrineName: doctrineData ? doctrineData.name : '-',
        hullType: hullData.name, 
        engineType: engineType ? shipData.components.engines[engineType].name : 'Nenhum',
        propellerConfig: propellerConfig ? shipData.components.propellers[propellerConfig].name : 'Padrão',
        steeringSystem: steeringSystem ? shipData.components.steering[steeringSystem].name : 'Padrão',
        finalCost, finalTonnage, finalConstructionTime, finalSpeed, finalRange,
        finalFirepower, finalAACapability, finalASWCapability, finalEffectiveArmor,
        finalReliability, aircraftCapacity,
        armamentDetails: {
            mainGuns: mainGunCaliber > 0 && mainGunQuantity > 0 ? `${mainGunQuantity}x ${mainGunCaliber}mm` : 'Nenhum',
            secondaryGuns: collectSecondaryArmament(),
            torpedoes: collectTorpedoes(),
            depthCharges: depthCharges > 0 ? `${depthCharges}x Cargas de Profundidade` : 'Nenhuma'
        },
        equipment: collectEquipment()
    };
}

// Funções auxiliares para coletar dados de armamento e equipamento
/**
 * Coleta uma string formatada dos armamentos secundários selecionados.
 * @returns {string} String com os armamentos secundários.
 */
function collectSecondaryArmament() {
    const armaments = [];
    ['aa_20mm', 'aa_37mm', 'aa_40mm', 'hybrid_90mm', 'hybrid_127mm', 'secondary_152mm'].forEach(id => {
        const qty = parseInt(document.getElementById(id).value) || 0;
        if(qty > 0) {
            const name = shipData.components.armaments[id]?.name; // Usa optional chaining
            if (name) armaments.push(`${qty}x ${name}`);
        }
    });
    return armaments.join(', ') || 'Nenhum';
}

/**
 * Coleta uma string formatada dos torpedos selecionados.
 * @returns {string} String com os torpedos.
 */
function collectTorpedoes() {
    const torpedoes = [];
    ['torpedo_433mm', 'torpedo_533mm', 'torpedo_633mm', 'torpedo_710mm'].forEach(id => {
        const qty = parseInt(document.getElementById(id).value) || 0;
        if(qty > 0) {
            const name = shipData.components.armaments[id]?.name; // Usa optional chaining
            if (name) torpedoes.push(`${qty}x ${name}`);
        }
    });
    return torpedoes.join(', ') || 'Nenhum';
}

/**
 * Coleta um array dos nomes dos equipamentos selecionados.
 * @returns {Array<string>} Array com os nomes dos equipamentos.
 */
function collectEquipment() {
    const equipment = [];
    document.querySelectorAll('#equipment-section input:checked').forEach(cb => {
        const itemName = shipData.components.equipment[cb.id]?.name; // Usa optional chaining
        if (itemName) equipment.push(itemName);
    });
    return equipment;
}

// Função para exibir uma mensagem de notificação (substitui alert)
/**
 * Exibe uma mensagem de notificação temporária na UI.
 * @param {string} message - A mensagem a ser exibida.
 * @param {string} type - O tipo de mensagem ('success', 'error', 'warning').
 */
function showNotification(message, type = 'success') {
    let notificationDiv = document.getElementById('app-notification');
    if (!notificationDiv) {
        notificationDiv = document.createElement('div');
        notificationDiv.id = 'app-notification';
        notificationDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 8px;
            font-weight: bold;
            color: white;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            opacity: 0;
            transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
            transform: translateY(-20px);
        `;
        document.body.appendChild(notificationDiv);
    }

    notificationDiv.textContent = message;
    notificationDiv.className = ''; // Limpa classes anteriores

    switch (type) {
        case 'success':
            notificationDiv.style.backgroundColor = '#28a745';
            break;
        case 'error':
            notificationDiv.style.backgroundColor = '#dc3545';
            break;
        case 'warning':
            notificationDiv.style.backgroundColor = '#ffc107';
            notificationDiv.style.color = '#333'; // Cor de texto para warnings
            break;
        default:
            notificationDiv.style.backgroundColor = '#6c757d';
    }

    notificationDiv.style.opacity = '1';
    notificationDiv.style.transform = 'translateY(0)';

    setTimeout(() => {
        notificationDiv.style.opacity = '0';
        notificationDiv.style.transform = 'translateY(-20px)';
        // Opcional: remover o elemento após a transição para limpar o DOM
        // setTimeout(() => notificationDiv.remove(), 500); 
    }, 3000);
}


/**
 * Salva o projeto do navio no localStorage e abre a ficha detalhada em uma nova janela.
 */
function saveShipDesign() {
    const shipDesignData = updateShipCalculations();
    if(shipDesignData) {
        localStorage.setItem('shipSheetData', JSON.stringify(shipDesignData));
        localStorage.setItem('historicalShipsData', JSON.stringify(historicalShips)); // Salva os dados de navios históricos também
        
        // Adiciona ao histórico de navios salvos
        let savedShips = JSON.parse(localStorage.getItem('savedShips') || '[]');
        // Evita duplicatas se o mesmo navio for salvo várias vezes sem alteração de nome
        const existingShipIndex = savedShips.findIndex(s => s.name === shipDesignData.shipName);
        if (existingShipIndex > -1) {
            savedShips[existingShipIndex] = {
                name: shipDesignData.shipName,
                class: shipDesignData.hullType,
                date: new Date().toISOString(),
                data: shipDesignData
            };
        } else {
            savedShips.push({
                name: shipDesignData.shipName,
                class: shipDesignData.hullType,
                date: new Date().toISOString(),
                data: shipDesignData
            });
        }
        localStorage.setItem('savedShips', JSON.stringify(savedShips));
        
        showNotification('Projeto salvo com sucesso!', 'success');
        window.open('ship_sheet.html', '_blank'); // Abre a ficha em nova janela
    } else {
        showNotification('Não foi possível salvar o projeto. Verifique os dados do navio.', 'error');
    }
}

/**
 * Carrega aeronaves salvas do localStorage e as exibe para seleção.
 */
function loadSavedAircraft() {
    const aircraftSelection = document.getElementById('aircraft_selection');
    const savedAircraft = JSON.parse(localStorage.getItem('savedAircraft') || '[]'); // Supondo que 'savedAircraft' exista de outro criador

    if(aircraftSelection) { // Garante que o elemento existe
        if(savedAircraft.length === 0) {
            aircraftSelection.innerHTML = '<p class="text-gray-600">Nenhuma aeronave salva encontrada. Crie aeronaves no sistema de criação de aeronaves.</p>';
            return;
        }
        
        aircraftSelection.innerHTML = '<h4 class="font-semibold mb-2">Aeronaves Disponíveis:</h4>';
        savedAircraft.forEach((aircraft, index) => {
            const div = document.createElement('div');
            div.className = 'aircraft-item';
            div.dataset.aircraftIndex = index; // Armazena o índice para fácil recuperação
            div.innerHTML = `
                <span>${aircraft.name} - ${aircraft.type}</span>
                <span class="text-sm text-gray-600">${aircraft.date ? new Date(aircraft.date).toLocaleDateString('pt-BR') : ''}</span>
            `;
            div.onclick = () => selectAircraft(index);
            aircraftSelection.appendChild(div);
        });
    }
}

/**
 * Seleciona uma aeronave na lista e a armazena no localStorage para a ficha do navio.
 * @param {number} index - O índice da aeronave selecionada no array `savedAircraft`.
 */
function selectAircraft(index) {
    document.querySelectorAll('.aircraft-item').forEach(item => item.classList.remove('selected'));
    const selectedItem = document.querySelector(`.aircraft-item[data-aircraft-index="${index}"]`);
    if (selectedItem) {
        selectedItem.classList.add('selected');
        const savedAircraft = JSON.parse(localStorage.getItem('savedAircraft') || '[]');
        const aircraftData = savedAircraft[index];
        if (aircraftData) {
            localStorage.setItem('selectedAircraftForShip', JSON.stringify(aircraftData));
            showNotification(`Aeronave '${aircraftData.name}' selecionada para o navio.`, 'info');
        }
    }
}

// --- INICIALIZAÇÃO ---
window.onload = function() {
    loadShipDataFromSheets();
    loadSavedAircraft();
    
    // Torna as funções globais para acesso direto no HTML
    window.updateShipCalculations = updateShipCalculations;
    window.saveShipDesign = saveShipDesign;
    window.estimateCrew = estimateCrew; // Torna estimateCrew global para ship_sheet.html
    
    // Click no resumo para abrir ficha
    const summaryPanel = document.querySelector('.summary-panel');
    if (summaryPanel) {
        summaryPanel.style.cursor = 'pointer';
        summaryPanel.title = 'Clique para gerar a ficha detalhada do navio';
        summaryPanel.addEventListener('click', () => {
            const shipData = updateShipCalculations();
            if(shipData) {
                localStorage.setItem('shipSheetData', JSON.stringify(shipData));
                localStorage.setItem('historicalShipsData', JSON.stringify(historicalShips)); // Passa os dados históricos
                window.open('ship_sheet.html', '_blank'); // Abre a ficha em nova janela
            } else {
                showNotification('Não é possível gerar a ficha. Preencha os dados obrigatórios do navio.', 'warning');
            }
        });
    }
};
