// =================================================================================
// CONSTRUTOR NAVAL AVANÇADO - LÓGICA PRINCIPAL (BALANCEAMENTO V13 - Correção de Erro)
// =================================================================================

const APP = {
    data: {
        hulls: {
            // Preços base dos cascos divididos por 4
            "submarine": { "name": "Submarino", "base_cost": 888750, "base_tonnage": 600, "base_speed": 15, "displacement_mod": 0.5, "max_speed": 25, "min_engine_slots": 1, "max_engine_slots": 2, "min_boiler_slots": 1, "max_boiler_slots": 2, "base_maneuverability": 90, "slots": { "main_armament": 1, "secondary_armament": 2, "torpedo": 4, "utility": 4 } },
            "destroyer": { "name": "Contratorpedeiro", "base_cost": 1481250, "base_tonnage": 1500, "base_speed": 35, "displacement_mod": 1.0, "max_speed": 45, "min_engine_slots": 1, "max_engine_slots": 4, "min_boiler_slots": 1, "max_boiler_slots": 4, "base_maneuverability": 85, "slots": { "main_armament": 2, "secondary_armament": 4, "torpedo": 2, "asw": 2, "utility": 6 } },
            "light_cruiser": { "name": "Cruzador Leve", "base_cost": 2962500, "base_tonnage": 4000, "base_speed": 32, "displacement_mod": 1.2, "max_speed": 38, "min_engine_slots": 2, "max_engine_slots": 6, "min_boiler_slots": 2, "max_boiler_slots": 6, "base_maneuverability": 75, "slots": { "main_armament": 3, "secondary_armament": 6, "torpedo": 2, "asw": 1, "utility": 8 } },
            "heavy_cruiser": { "name": "Cruzador Pesado", "base_cost": 5925000, "base_tonnage": 10000, "base_speed": 30, "displacement_mod": 1.5, "max_speed": 35, "min_engine_slots": 3, "max_engine_slots": 8, "min_boiler_slots": 3, "max_boiler_slots": 8, "base_maneuverability": 65, "slots": { "main_armament": 4, "secondary_armament": 8, "torpedo": 2, "utility": 10 } },
            "battle_cruiser": { "name": "Cruzador de Batalha", "base_cost": 8887500, "base_tonnage": 25000, "base_speed": 30, "displacement_mod": 2.0, "max_speed": 33, "min_engine_slots": 4, "max_engine_slots": 10, "min_boiler_slots": 4, "max_boiler_slots": 10, "base_maneuverability": 55, "slots": { "main_armament": 6, "secondary_armament": 8, "utility": 12 } },
            "battleship": { "name": "Encouraçado", "base_cost": 11850000, "base_tonnage": 35000, "base_speed": 25, "displacement_mod": 2.5, "max_speed": 30, "min_engine_slots": 4, "max_engine_slots": 12, "min_boiler_slots": 4, "max_boiler_slots": 12, "base_maneuverability": 40, "slots": { "main_armament": 8, "secondary_armament": 10, "utility": 14 } }, 
            "escort_carrier": { "name": "Porta-Aviões de Escolta", "base_cost": 7900000, "base_tonnage": 10000, "base_speed": 20, "displacement_mod": 1.2, "max_speed": 28, "min_engine_slots": 2, "max_engine_slots": 6, "min_boiler_slots": 2, "max_boiler_slots": 6, "base_maneuverability": 60, "slots": { "secondary_armament": 4, "utility": 8 } },
            "fleet_carrier": { "name": "Porta-Aviões de Esquadra", "base_cost": 26662500, "base_tonnage": 27000, "base_speed": 32, "displacement_mod": 2.2, "max_speed": 34, "min_engine_slots": 4, "max_engine_slots": 10, "min_boiler_slots": 4, "max_boiler_slots": 10, "base_maneuverability": 50, "slots": { "secondary_armament": 8, "utility": 16 } }
        },
        // Novas categorias de propulsão com descrições e balanceamento ajustado
        fuels: {
            "coal": { "name": "Carvão", "cost_mod": 0.5, "tonnage_mod": 1.5, "power_mod": 0.8, "range_factor": 0.7, "reliability_mod": 0.90, "description": "Combustível tradicional, **muito barato** mas **extremamente pesado** e **pouco eficiente**. Reduz a potência, confiabilidade e alcance. Ideal para orçamentos apertados." },
            "semi_oil": { "name": "Semi-Óleo", "cost_mod": 1.0, "tonnage_mod": 1.0, "power_mod": 1.0, "range_factor": 1.0, "reliability_mod": 1.0, "description": "Um bom equilíbrio entre custo, peso e eficiência. Padrão para a maioria dos navios." },
            "diesel_fuel": { "name": "Diesel", "cost_mod": 2.5, "tonnage_mod": 0.7, "power_mod": 1.15, "range_factor": 1.3, "reliability_mod": 1.05, "description": "Combustível moderno, **muito mais caro** mas **leve** e **altamente eficiente**. Aumenta a potência e o alcance. Excelente para navios de alta performance." }
        },
        boilers: {
            // Preços das caldeiras divididos por 4
            "natural": { "name": "Naturais", "cost_per_unit": 200000, "tonnage_per_unit": 50, "power_per_unit": 20, "reliability_mod": 1.0, "description": "Caldeiras de convecção natural, simples e robustas. Boa confiabilidade, potência padrão. **Mais baratas**." },
            "induced": { "name": "Induzidas", "cost_per_unit": 450000, "tonnage_per_unit": 60, "power_per_unit": 25, "reliability_mod": 0.98, "description": "Com tiragem induzida para maior eficiência. Um pouco mais potentes, mas levemente menos confiáveis. **Custo moderado**." },
            "forced": { "name": "Forçadas", "cost_per_unit": 750000, "tonnage_per_unit": 70, "power_per_unit": 30, "reliability_mod": 0.95, "description": "Caldeiras de tiragem forçada, oferecem alta potência. Mais pesadas e com menor confiabilidade. **Mais caras**." },
            "balanced": { "name": "Balanceadas", "cost_per_unit": 1000000, "tonnage_per_unit": 65, "power_per_unit": 28, "reliability_mod": 1.02, "description": "Design otimizado para equilíbrio entre potência e confiabilidade. **Mais caras**, mas com bom desempenho geral." }
        },
        main_engines: { 
            // Preços dos motores principais divididos por 4
            "steam_turbine": { "name": "Turbina a Vapor", "cost_per_unit": 1750000, "tonnage_per_unit": 500, "base_power_per_unit": 500, "stability_mod_per_unit": -5, "maneuverability_mod_per_unit": -2, "description": "Potentes e suaves, ideais para altas velocidades. Podem reduzir a estabilidade e manobrabilidade. **Custo base moderado**." }, 
            "diesel": { "name": "Motor a Diesel", "cost_per_unit": 2500000, "tonnage_per_unit": 450, "base_power_per_unit": 600, "stability_mod_per_unit": -3, "maneuverability_mod_per_unit": 0, "description": "Eficientes em cruzeiro, boa economia de combustível. Impacto neutro na manobrabilidade. **Custo base alto**." }, 
            "diesel_electric": { "name": "Motor Eletro-diesel", "cost_per_unit": 5000000, "tonnage_per_unit": 550, "base_power_per_unit": 750, "stability_mod_per_unit": -8, "maneuverability_mod_per_unit": 5, "description": "Oferecem grande flexibilidade e boa manobrabilidade. **Muito mais caros** e podem reduzir a estabilidade." }, 
            "gas_turbine": { "name": "Turbina a Gás (Experimental)", "cost_per_unit": 8750000, "tonnage_per_unit": 400, "base_power_per_unit": 1000, "stability_mod_per_unit": -10, "maneuverability_mod_per_unit": 8, "description": "Leves e **extremamente potentes**, mas **muito caras**. Oferecem excelente manobrabilidade e velocidade máxima." } 
        },
        auxiliaries: {
            // Preços dos auxiliares divididos por 4
            "none": { "name": "Nenhum", "cost": 0, "tonnage": 0, "power_add": 0, "reliability_mod": 1.0, "maneuverability_mod": 1.0, "slots_required": 0, "description": "Nenhum sistema auxiliar de energia instalado." },
            "gasoline_gen": { "name": "Motor a Gasolina (Gerador)", "cost": 375000, "tonnage": 10, "power_add": 50, "reliability_mod": 0.98, "maneuverability_mod": 0.98, "slots_required": 1, "description": "Gerador pequeno para necessidades básicas. Leve, mas menos confiável. **Barato**." }, 
            "diesel_gen": { "name": "Motor a Diesel (Gerador)", "cost": 625000, "tonnage": 15, "power_add": 75, "reliability_mod": 1.0, "maneuverability_mod": 1.0, "slots_required": 1, "description": "Gerador diesel padrão, bom equilíbrio entre custo e potência. Confiabilidade neutra. **Custo moderado**." }, 
            "diesel_electric_gen": { "name": "Eletro-diesel (Gerador)", "cost": 1000000, "tonnage": 20, "power_add": 125, "reliability_mod": 1.02, "maneuverability_mod": 1.05, "slots_required": 2, "description": "Gerador avançado, alta potência e boa confiabilidade. Pode melhorar a manobrabilidade geral. **Mais caro**." } 
        },
        propellers: {
            "twin": { "name": "Duplas", "cost_mod": 1.0, "tonnage_mod_factor": 0.005, "efficiency": 1.0, "stability_mod": 0, "maneuverability_mod": 1.0, "description": "Configuração de hélice mais comum. Bom equilíbrio e manobrabilidade padrão." },
            "triple": { "name": "Triplas", "cost_mod": 1.2, "tonnage_mod_factor": 0.008, "efficiency": 1.05, "stability_mod": -5, "maneuverability_mod": 1.08, "description": "Oferecem maior propulsão, mas com aumento de peso e impacto na estabilidade. **Melhora a manobrabilidade significativamente**." }, 
            "quad": { "name": "Quádruplas", "cost_mod": 1.5, "tonnage_mod_factor": 0.012, "efficiency": 1.1, "stability_mod": -10, "maneuverability_mod": 1.15, "description": "Máxima eficiência de propulsão, mas são as mais pesadas e afetam mais a estabilidade. Oferecem a **melhor manobrabilidade**." } 
        },
        steering_mechanism: {
            // Preços dos mecanismos de direção divididos por 4
            "steam": { "name": "A Vapor", "cost": 500000, "tonnage": 5, "reliability_mod": 0.95, "stability_mod": 0, "maneuverability_mod": 0.9, "description": "Mecanismo tradicional, simples mas menos responsivo. **Reduz a manobrabilidade**. Mais barato." },
            "hydraulic": { "name": "Hidráulica", "cost": 1250000, "tonnage": 8, "reliability_mod": 1.0, "stability_mod": 1, "maneuverability_mod": 1.0, "description": "Sistema mais moderno e responsivo. Bom equilíbrio entre custo e desempenho." },
            "electric": { "name": "Elétrica", "cost": 2000000, "tonnage": 10, "reliability_mod": 1.02, "stability_mod": 2, "maneuverability_mod": 1.1, "description": "Alta precisão e resposta rápida. **Melhora a manobrabilidade e estabilidade**. Mais caro." },
            "electro_hydraulic": { "name": "Eletro-Hidráulica", "cost": 3000000, "tonnage": 12, "reliability_mod": 1.05, "stability_mod": 3, "maneuverability_mod": 1.15, "description": "O mais avançado, oferece controle superior e **máxima manobrabilidade**. Aumenta a confiabilidade e estabilidade. **Muito caro**." }
        },
        armor: {
            // Removidas as entradas com I, II, III, IV, V e Modern
            "none": { "name": "Sem Blindagem", "cost_per_mm_ton": 0, "tonnage_per_mm_ton": 0, "effectiveness": 0, "description": "Nenhuma proteção adicional. Leve, mas vulnerável." },
            "iron_plate": { "name": "Placa de Ferro", "cost_per_mm_ton": 25, "tonnage_per_mm_ton": 2.5, "effectiveness": 0.7, "description": "Blindagem inicial, pesada e menos eficaz. **Muito barata**." },
            "compound": { "name": "Composta", "cost_per_mm_ton": 30, "tonnage_per_mm_ton": 2.2, "effectiveness": 0.75, "description": "Combinação de ferro e aço. Melhor que a placa de ferro, com menor peso." },
            "nickel_steel": { "name": "Aço Níquel", "cost_per_mm_ton": 35, "tonnage_per_mm_ton": 2.0, "effectiveness": 0.8, "description": "Aço com adição de níquel para maior resistência. Boa relação custo-benefício." },
            "harvey": { "name": "Harvey", "cost_per_mm_ton": 37.5, "tonnage_per_mm_ton": 2, "effectiveness": 0.8, "description": "Blindagem de aço temperado, boa proteção para seu custo e peso." },
            "krupp": { "name": "Krupp", "cost_per_mm_ton": 50, "tonnage_per_mm_ton": 2.5, "effectiveness": 1.0, "description": "Padrão de blindagem cimentada, oferece excelente proteção. Bom equilíbrio." },
            "kca": { "name": "KCA (Aço Krupp Cimentado)", "cost_per_mm_ton": 62.5, "tonnage_per_mm_ton": 3, "effectiveness": 1.2, "description": "Blindagem de alta resistência, superior ao Krupp. Mais cara e pesada." },
            "homogeneous": { "name": "Homogênea", "cost_per_mm_ton": 56.25, "tonnage_per_mm_ton": 3, "effectiveness": 1.1, "description": "Blindagem de composição uniforme, oferece boa resistência contra projéteis de alto explosivo." },
            "ducol": { "name": "Aço Ducol", "cost_per_mm_ton": 75, "tonnage_per_mm_ton": 2.8, "effectiveness": 1.15, "description": "Aço de alta elasticidade, leve e com boa absorção de impacto. Caro." },
            "triple_hull_bottom": { "name": "Fundo de Casco Triplo", "cost_per_mm_ton": 100, "tonnage_per_mm_ton": 0.5, "effectiveness": 0.1, "slots": 2, "description": "Camada extra no fundo do casco para proteção contra minas e torpedos. Adiciona peso e custo, mas melhora a sobrevivência." } 
        },
        armaments: {
            "gun_marks": {
                "I": { "name": "Mark I", "cost_mod": 1.0, "tonnage_mod": 1.0, "power_mod": 1.0, "slots_mod": 1.0, "accuracy_mod": 1.0, "description": "Projeto básico de canhão. Confiável, mas com desempenho limitado." },
                "II": { "name": "Mark II", "cost_mod": 1.5, "tonnage_mod": 0.95, "power_mod": 1.1, "slots_mod": 1.0, "accuracy_mod": 1.1, "description": "Melhorias na balística e carregamento. Aumenta a precisão e poder de fogo." },
                "III": { "name": "Mark III", "cost_mod": 2.5, "tonnage_mod": 0.9, "power_mod": 1.25, "slots_mod": 1.2, "accuracy_mod": 1.25, "description": "Design avançado com maior cadência de tiro e precisão. Mais caro e consome mais energia." },
                "IV": { "name": "Mark IV", "cost_mod": 4.0, "tonnage_mod": 0.85, "power_mod": 1.4, "slots_mod": 1.3, "accuracy_mod": 1.4, "description": "Tecnologia de ponta para canhões. Leve, muito potente e preciso, mas com alto custo." },
                "V": { "name": "Mark V", "cost_mod": 7.0, "tonnage_mod": 0.8, "power_mod": 1.6, "slots_mod": 1.5, "accuracy_mod": 1.6, "description": "O auge da tecnologia de canhões. Extremamente caro, mas oferece desempenho inigualável." }
            },
            "torpedo_marks": {
                "I": { "name": "Mark I", "cost_mod": 1.0, "tonnage_mod": 1.0, "power_mod": 1.0, "slots_mod": 1.0, "damage_mod": 1.0, "description": "Torpedo básico. Confiável, mas com alcance e dano limitados." },
                "II": { "name": "Mark II", "cost_mod": 1.5, "tonnage_mod": 1.0, "power_mod": 1.2, "slots_mod": 1.0, "damage_mod": 1.2, "description": "Melhorias no motor e ogiva. Aumenta o alcance e o dano." },
                "III": { "name": "Mark III", "cost_mod": 2.2, "tonnage_mod": 1.1, "power_mod": 1.4, "slots_mod": 1.2, "damage_mod": 1.5, "description": "Torpedo avançado com maior velocidade e poder destrutivo. Mais pesado e consome mais energia." },
                "IV": { "name": "Mark IV (Oxigênio)", "cost_mod": 3.5, "tonnage_mod": 1.2, "power_mod": 1.6, "slots_mod": 1.5, "damage_mod": 2.0, "description": "Torpedos de oxigênio, extremamente potentes e de longo alcance. Muito caros e pesados." }
            },
            "aa_guns": { 
                // Preços das armas AA divididos por 4
                "light_aa": { "name": "AA Leve (20mm)", "cost_per_unit": 125000, "tonnage_per_unit": 0.5, "power_draw_per_unit": 1, "aa_rating_per_unit": 5, "slots_per_unit": 0.1, "description": "Canhões automáticos de pequeno calibre. Eficazes contra aeronaves de baixo voo e torpedeiros. **Barato e leve**." },
                "medium_aa": { "name": "AA Média (40mm)", "cost_per_unit": 375000, "tonnage_per_unit": 2, "power_draw_per_unit": 3, "aa_rating_per_unit": 15, "slots_per_unit": 0.3, "description": "Canhões de médio calibre. Bom equilíbrio entre alcance e poder de fogo antiaéreo. **Custo moderado**." },
                "heavy_aa": { "name": "AA Pesada (76mm+)", "cost_per_unit": 750000, "tonnage_per_unit": 5, "power_draw_per_unit": 5, "aa_rating_per_unit": 30, "slots_per_unit": 0.5, "description": "Canhões de grande calibre com espoletas de proximidade. Alta capacidade de abater aeronaves a longa distância. **Mais caro e pesado**." }
            },
            // REMOVIDAS as balísticas de munições HE e AP
            "shell_size": { // Tamanho das Munições
                "light": { "name": "Leve", "cost_mod": 0.8, "tonnage_mod": 0.8, "damage_mod": 0.9, "penetration_mod": 0.9, "firepower_mod": 1.1, "description": "Munições mais leves. Reduzem peso e custo, mas diminuem dano e penetração. Aumentam a cadência de tiro." },
                "standard": { "name": "Padrão", "cost_mod": 1.0, "tonnage_mod": 1.0, "damage_mod": 1.0, "penetration_mod": 1.0, "firepower_mod": 1.0, "description": "Tamanho padrão de munição. Equilíbrio entre peso, custo e desempenho." },
                "heavy": { "name": "Pesada", "cost_mod": 1.2, "tonnage_mod": 1.2, "damage_mod": 1.1, "penetration_mod": 1.1, "firepower_mod": 0.9, "description": "Munições mais pesadas. Aumentam dano e penetração, mas são mais caras e pesadas. Reduzem a cadência de tiro." },
                "super_heavy": { "name": "Super Pesada", "cost_mod": 1.5, "tonnage_mod": 1.5, "damage_mod": 1.2, "penetration_mod": 1.2, "firepower_mod": 0.8, "description": "Munições super pesadas. Máximo dano e penetração, mas com custo e peso muito altos. Redução significativa na cadência de tiro." }
            },
            "propellant": { // Propelente
                // Unificadas as entradas com numerais romanos
                "brown_powder": { "name": "Pólvora Marrom", "cost_mod": 0.8, "power_mod": 0.9, "flash_fire_chance_mod": 1.2, "description": "Pólvora marrom. Barata e segura, mas menos potente. Alto risco de incêndio em paióis." },
                "white_powder": { "name": "Pólvora Branca", "cost_mod": 0.9, "power_mod": 0.95, "flash_fire_chance_mod": 1.1, "description": "Pólvora branca. Melhor que a marrom, mas ainda com riscos." },
                "ballistite": { "name": "Balistita", "cost_mod": 1.0, "power_mod": 1.0, "flash_fire_chance_mod": 1.0, "description": "Propelente padrão. Bom equilíbrio de potência e segurança." },
                "cordite": { "name": "Cordite", "cost_mod": 1.2, "power_mod": 1.1, "flash_fire_chance_mod": 0.8, "description": "Cordite aprimorada. Oferece mais potência e segurança." }, 
                "tube_powder": { "name": "Pólvora em Tubo", "cost_mod": 1.5, "power_mod": 1.25, "flash_fire_chance_mod": 0.5, "description": "Pólvora em tubo aprimorada. Máxima potência e segurança." }, 
                "triple_base": { "name": "Base Tripla", "cost_mod": 2.0, "power_mod": 1.4, "flash_fire_chance_mod": 0.25, "description": "Propelente de base tripla. Extremamente potente e seguro, mas com custo proibitivo. Requer reforço das torretas." }
            },
            "bursting_charge": { // Carga Explosiva
                // Unificadas as entradas com numerais romanos
                "black_powder": { "name": "Pólvora Negra", "cost_mod": 0.8, "damage_mod": 0.9, "flash_fire_chance_mod": 1.2, "description": "Carga explosiva de pólvora negra. Barata, mas com menor dano e maior risco de incêndio." },
                "guncotton": { "name": "Algodão-Pólvora", "cost_mod": 0.9, "damage_mod": 0.95, "flash_fire_chance_mod": 1.1, "description": "Algodão-pólvora. Melhor que a pólvora negra, mas ainda com riscos." },
                "picric_acid": { "name": "Ácido Pícrico", "cost_mod": 1.0, "damage_mod": 1.0, "flash_fire_chance_mod": 1.0, "description": "Ácido pícrico. Carga explosiva padrão. Bom equilíbrio de dano e segurança." }, 
                "tnt": { "name": "TNT", "cost_mod": 1.1, "damage_mod": 1.05, "flash_fire_chance_mod": 0.9, "description": "TNT. Mais potente e segura que o ácido pícrico, mas mais cara." }, 
                "dunnite": { "name": "Dunnite", "cost_mod": 1.2, "damage_mod": 1.1, "flash_fire_chance_mod": 0.8, "description": "Dunnite. Oferece mais dano e segurança." }
            },
            "turret_traverse": { // Virada da Torre
                // Unificadas as entradas com numerais romanos
                "hydraulic": { "name": "Hidráulica", "cost_mod": 1.0, "power_draw_mod": 1.0, "traverse_speed_mod": 1.0, "reliability_mod": 1.0, "description": "Mecanismo de virada hidráulico padrão. Confiável e com boa velocidade." },
                "adv_hydraulic": { "name": "Hidráulica Avançada", "cost_mod": 1.2, "power_draw_mod": 1.1, "traverse_speed_mod": 1.1, "reliability_mod": 1.02, "description": "Sistema hidráulico avançado. Melhora a velocidade de virada e confiabilidade." },
                "electrical": { "name": "Elétrica", "cost_mod": 1.5, "power_draw_mod": 1.2, "traverse_speed_mod": 1.2, "reliability_mod": 1.05, "description": "Mecanismo elétrico. Mais rápido e preciso, mas consome mais energia." },
                "electro_hydro": { "name": "Eletro-Hidráulica", "cost_mod": 1.8, "power_draw_mod": 1.3, "traverse_speed_mod": 1.3, "reliability_mod": 1.08, "description": "Combinação eletro-hidráulica. Oferece a máxima velocidade de virada e confiabilidade, mas com alto custo e consumo de energia." }
            },
            "reloading_method": { // Método de Recarga
                // Unificadas as entradas com numerais romanos
                "standard": { "name": "Padrão", "cost_mod": 1.0, "power_draw_mod": 1.0, "reload_speed_mod": 1.0, "reliability_mod": 1.0, "description": "Método de recarga padrão. Confiável, mas com velocidade média." },
                "enhanced": { "name": "Aprimorada", "cost_mod": 1.2, "power_draw_mod": 1.1, "reload_speed_mod": 1.1, "reliability_mod": 1.02, "description": "Recarga aprimorada. Aumenta a velocidade de recarga e confiabilidade." },
                "semi_auto": { "name": "Semi-Automática", "cost_mod": 1.5, "power_draw_mod": 1.2, "reload_speed_mod": 1.25, "reliability_mod": 0.98, "description": "Recarga semi-automática. Aumenta significativamente a cadência de tiro, mas pode reduzir a confiabilidade." },
                "auto": { "name": "Automática", "cost_mod": 2.5, "power_draw_mod": 1.4, "reload_speed_mod": 1.5, "reliability_mod": 0.92, "description": "Recarga automática. Máxima cadência de tiro, porém muito cara e com menor confiabilidade." } 
            },
            "base_values": {
                // Preço base do canhão por mm dividido por 4
                "gun": { "cost_per_mm": 125, "tonnage_per_mm": 0.08, "power_draw_per_mm": 0.02, "firepower_per_mm": 0.2, "slots_per_turret": 1, "stability_penalty_per_ton": 0.1 },
                // Preço base do torpedo por tubo dividido por 4
                "torpedo": { "cost_per_tube": 375000, "tonnage_per_tube": 2, "power_draw_per_tube": 3, "slots_per_launcher": 1 }
            }
        },
        components: {
            "protection": {
                "title": "Proteção", "icon": "fa-shield-alt", "options": {
                    "bulkheads": { "name": "Anteparas (Bulkheads)", "type": "select", "options": { 
                        // Preços das anteparas divididos por 4
                        "1": { "name": "Mínima", "cost_mod": 0.95, "tonnage_mod": 0.95, "reliability_mod": 0.95, "stability_mod": -5, "cost": 250000, "tonnage": 50, "description": "Proteção básica contra inundações. Leve, mas menos eficaz. **Baixo custo e peso**." }, 
                        "2": { "name": "Padrão", "cost_mod": 1.0, "tonnage_mod": 1.0, "reliability_mod": 1.0, "stability_mod": 0, "cost": 625000, "tonnage": 100, "description": "Sistema de anteparas padrão. Bom equilíbrio. **Custo e peso moderados**." }, 
                        "3": { "name": "Reforçada", "cost_mod": 1.1, "tonnage_mod": 1.1, "reliability_mod": 1.05, "stability_mod": 5, "cost": 1250000, "tonnage": 150, "description": "Anteparas reforçadas para maior resistência a danos. Aumenta a confiabilidade e estabilidade. **Mais caro e pesado**." }, 
                        "4": { "name": "Máxima", "cost_mod": 1.2, "tonnage_mod": 1.2, "reliability_mod": 1.1, "stability_mod": 10, "cost": 2000000, "tonnage": 200, "description": "Proteção máxima contra inundações. Pesada, mas oferece alta confiabilidade e estabilidade. **Alto custo e peso**." } } 
                    },
                    "anti_torpedo": { "name": "Proteção Anti-Torpedo", "type": "select", "options": { 
                        // Preços da proteção anti-torpedo divididos por 4
                        "none": { "name": "Nenhuma", "cost": 0, "tonnage": 0, "slots": 0, "description": "Sem proteção específica contra torpedos. Vulnerável." }, 
                        "basic": { "name": "Básica", "cost": 1875000, "tonnage": 150, "slots": 2, "description": "Cinturão anti-torpedo simples. Oferece alguma proteção." }, 
                        "advanced": { "name": "Avançada", "cost": 3750000, "tonnage": 300, "slots": 3, "description": "Sistema de proteção multi-camadas contra torpedos. Mais pesado, mas muito eficaz." } } 
                    },
                    "anti_flood": { "name": "Proteção Anti-Alagamento", "type": "select", "options": { 
                        // Preços da proteção anti-alagamento divididos por 4
                        "none": { "name": "Nenhum", "cost": 0, "tonnage": 0, "slots": 0, "description": "Sem sistemas de controle de danos. Alto risco de alagamento." }, 
                        "basic": { "name": "Básica", "cost": 1125000, "tonnage": 100, "slots": 2, "description": "Sistemas básicos de bombeamento e vedação. Ajuda a conter alagamentos." }, 
                        "advanced": { "name": "Avançada", "cost": 2250000, "tonnage": 200, "slots": 3, "description": "Sistemas automatizados e redundantes de controle de danos. Aumenta significativamente a capacidade de sobrevivência." } } 
                    }
                }
            },
            "fire_control": {
                "title": "Controle de Tiro", "icon": "fa-crosshairs", "options": {
                    "rangefinder": { "name": "Telêmetro", "type": "select", "options": { 
                        // Preços do telêmetro divididos por 4
                        "none": { "name": "Nenhum", "cost": 0, "tonnage": 0, "slots": 0, "accuracy_mod": 1.0, "power_draw": 0, "description": "Sem telêmetro. Dependência da observação visual." }, 
                        "optical": { "name": "Óptico", "cost": 1000000, "tonnage": 5, "slots": 1, "accuracy_mod": 1.05, "power_draw": 2, "description": "Telêmetro óptico padrão. Melhora a precisão do tiro." }, 
                        "stereoscopic": { "name": "Estereoscópico", "cost": 2000000, "tonnage": 8, "slots": 1, "accuracy_mod": 1.1, "power_draw": 5, "description": "Telêmetro avançado com maior precisão na medição de distância." } } 
                    },
                    "fire_control_system": { "name": "Sistema de Controle de Tiro", "type": "select", "options": { 
                        // Preços do sistema de controle de tiro divididos por 4
                        "none": { "name": "Nenhum", "cost": 0, "tonnage": 0, "slots": 0, "accuracy_mod": 1.0, "power_draw": 0, "description": "Sem sistema de controle de tiro dedicado. Precisão limitada." }, 
                        "analog": { "name": "Computador Analógico", "cost": 3750000, "tonnage": 15, "slots": 2, "accuracy_mod": 1.15, "power_draw": 15, "description": "Computador mecânico para cálculo de tiro. Melhora a precisão e cadência." }, 
                        "advanced": { "name": "Radar de Controle de Fogo", "cost": 6250000, "tonnage": 25, "slots": 3, "accuracy_mod": 1.25, "power_draw": 30, "description": "Sistema de controle de tiro baseado em radar. Oferece a melhor precisão, especialmente em condições adversas." } } 
                    }
                }
            },
            "sensors": {
                "title": "Sensores", "icon": "fa-satellite-dish", "options": {
                    "radar": { "name": "Radar", "type": "select", "options": { 
                        // Preços do radar divididos por 4
                        "none": { "name": "Nenhum", "cost": 0, "tonnage": 0, "slots": 0, "power_draw": 0, "description": "Sem capacidade de detecção por radar." }, 
                        "search": { "name": "Busca", "cost": 2625000, "tonnage": 15, "slots": 2, "power_draw": 20, "description": "Radar para detecção de superfície e aérea. Aumenta a consciência situacional." }, 
                        "advanced_search": { "name": "Busca Avançada", "cost": 5000000, "tonnage": 20, "slots": 2, "power_draw": 25, "description": "Radar com maior alcance e resolução. Essencial para detecção de longo alcance." } 
                    },
                    "sonar": { "name": "Sonar", "type": "select", "options": { 
                        // Preços do sonar divididos por 4
                        "none": { "name": "Nenhum", "cost": 0, "tonnage": 0, "slots": 0, "power_draw": 0, "description": "Sem capacidade de detecção submarina." }, 
                        "passive": { "name": "Passivo (Hidrofone)", "cost": 1250000, "tonnage": 5, "slots": 1, "power_draw": 5, "description": "Hidrofone para detecção passiva de submarinos. Silencioso, mas limitado." }, 
                        "active": { "name": "Ativo (ASDIC)", "cost": 2625000, "tonnage": 10, "slots": 2, "power_draw": 15, "description": "Sonar ativo para detecção e localização precisa de submarinos. Mais eficaz, mas pode ser detectado." } } 
                    },
                    "radio": { "name": "Comunicações", "type": "select", "options": { 
                        // Preços do rádio divididos por 4
                        "telegraph": { "name": "Telégrafo", "cost": 387500, "tonnage": 3, "slots": 1, "power_draw": 1, "description": "Comunicações básicas por telégrafo. Confiável, mas limitada em velocidade." }, 
                        "radio": { "name": "Rádio de Longo Alcance", "cost": 750000, "tonnage": 5, "slots": 1, "power_draw": 5, "description": "Rádio para comunicação a longas distâncias. Essencial para operações de frota." }, 
                        "crypto": { "name": "Rádio com Criptografia", "cost": 1875000, "tonnage": 8, "slots": 2, "power_draw": 10, "description": "Comunicações seguras com criptografia. Protege informações sensíveis, mas consome mais energia." } } 
                    }
                }
            }
        },
        doctrines: {
            "decisive_battle": { "name": "Batalha Decisiva", "cost_modifier": 1.2, "performance_bonus": { "firepower": 1.15, "armor": 1.10 }, "description": "Foca em poder de fogo e blindagem para confrontos diretos." },
            "convoy_warfare": { "name": "Guerra de Comboios", "cost_modifier": 0.9, "performance_bonus": { "asw": 1.2, "range": 1.1 }, "description": "Otimiza navios para proteção de comboios, com foco em ASW e alcance." },
            "power_projection": { "name": "Poder de Projeção", "cost_modifier": 1.25, "performance_bonus": { "aa": 1.1 }, "description": "Prioriza a capacidade de projetar poder, com forte defesa antiaérea." },
            "submarine_warfare": { "name": "Guerra Submarina", "cost_modifier": 0.95, "performance_bonus": { "torpedo": 1.15 }, "description": "Especializa-se em operações submarinas e armamentos de torpedo." },
            "fleet_in_being": { "name": "Frota em Potencial", "cost_modifier": 1.1, "performance_bonus": { "all": 1.05 }, "description": "Busca uma frota equilibrada e dissuasora, com bônus gerais de desempenho." },
            "commerce_raiding": { "name": "Guerra ao Comércio", "cost_modifier": 1.0, "performance_bonus": { "speed": 1.15, "range": 1.2 }, "description": "Foca em velocidade e alcance para interceptar e atacar o comércio inimigo." }
        },
        countries: {}
    },
    state: {
        shipName: "Novo Projeto",
        country: null,
        doctrine: null,
        hull: null,
        // Novas propriedades de propulsão
        fuel_type: null,
        boiler_type: null,
        number_of_boilers: 1,
        main_engine_type: null,
        number_of_main_engines: 1,
        auxiliary_engine_type: 'none',
        propeller_type: null,
        steering_mechanism_type: null,
        // Sliders
        sliders: {
            displacement: 100,
            speed: 25, // Velocidade alvo inicial
            range: 8000 // Alcance alvo inicial
        },
        armor: { type: 'none', thickness: 0 },
        armaments: [],
        components: {
            // Inicializa os novos componentes de armamento com valores padrão
            shell_size: null, // Será definido no setupUi
            propellant: null, // Será definido no setupUi
            bursting_charge: null, // Será definido no setupUi
            turret_traverse: null, // Será definido no setupUi
            reloading_method: null // Será definido no setupUi
        }
    },
    sheetUrls: {
        country_stats: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR5Pw3aRXSTIGMglyNAUNqLtOl7wjX9bMeFXEASkQYC34g_zDyDx3LE8Vm73FUoNn27UAlKLizQBXBO/pub?gid=0&single=true&output=csv',
        naval_capacity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR5Pw3aRXSTIGMglyNAUNqLtOl7wjX9bMeFXEASkQYC34g_zDyDx3LE8Vm73FUoNn27UAlKLizQBXBO/pub?gid=580175793&single=true&output=csv'
    }
};

// =================================================================================
// INICIALIZAÇÃO E CARREGAMENTO DE DADOS
// =================================================================================

APP.init = async () => {
    console.log("Inicializando Construtor Naval...");
    await APP.loadSheetData();
    APP.setupUi();
    APP.updateCalculations();
    console.log("Construtor Naval Pronto.", APP.data);
};

APP.loadSheetData = async () => {
    try {
        const [countryStatsRaw, navalCapacityRaw] = await Promise.all([
            APP.parseCSV(APP.sheetUrls.country_stats),
            APP.parseCSV(APP.sheetUrls.naval_capacity)
        ]);
        const countriesData = {};
        countryStatsRaw.forEach(row => {
            const countryName = row['País'];
            if (countryName) {
                countriesData[countryName] = {
                    name: countryName,
                    tech_naval: parseFloat(row['Marinha'].replace(',', '.')) || 50,
                    production_capacity: 0
                };
            }
        });
        navalCapacityRaw.forEach(row => {
            const countryName = row['País'];
            if (countriesData[countryName]) {
                countriesData[countryName].production_capacity = parseFloat(row['Capacidade de produção'].replace(/\./g, '').replace(',', '.')) || 1000000;
            }
        });
        countriesData["Genérico / Padrão"] = { name: "Genérico / Padrão", production_capacity: 100000000, tech_naval: 50 };
        APP.data.countries = countriesData;
    } catch (error) {
        console.warn("Não foi possível carregar dados das planilhas. Usando dados de fallback.", error);
        APP.data.countries = { "Genérico / Falha": { name: "Genérico / Falha", production_capacity: 100000000, tech_naval: 50 } };
    }
};

APP.parseCSV = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erro no fetch do CSV: ${url}`);
    const csvText = await response.text();
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        let row = {};
        headers.forEach((header, i) => { row[header] = values[i] || ''; });
        return row;
    });
};

// =================================================================================
// CONFIGURAÇÃO DA INTERFACE (UI)
// =================================================================================

APP.setupUi = () => {
    APP.populateSelect('country', Object.keys(APP.data.countries));
    APP.populateSelect('naval_doctrine', Object.keys(APP.data.doctrines).map(key => APP.data.doctrines[key].name), Object.keys(APP.data.doctrines));
    APP.populateSelect('hull_type', Object.keys(APP.data.hulls).map(key => APP.data.hulls[key].name), Object.keys(APP.data.hulls));
    
    // Novos seletores de propulsão
    APP.populateSelect('fuel_type', Object.keys(APP.data.fuels).map(key => APP.data.fuels[key].name), Object.keys(APP.data.fuels));
    APP.populateSelect('boiler_type', Object.keys(APP.data.boilers).map(key => APP.data.boilers[key].name), Object.keys(APP.data.boilers));
    APP.populateSelect('main_engine_type', Object.keys(APP.data.main_engines).map(key => APP.data.main_engines[key].name), Object.keys(APP.data.main_engines));
    APP.populateSelect('auxiliary_engine_type', Object.keys(APP.data.auxiliaries).map(key => APP.data.auxiliaries[key].name), Object.keys(APP.data.auxiliaries));
    APP.populateSelect('propeller_type', Object.keys(APP.data.propellers).map(key => APP.data.propellers[key].name), Object.keys(APP.data.propellers));
    APP.populateSelect('steering_mechanism_type', Object.keys(APP.data.steering_mechanism).map(key => APP.data.steering_mechanism[key].name), Object.keys(APP.data.steering_mechanism));

    APP.populateSelect('armor_type', Object.keys(APP.data.armor).map(key => APP.data.armor[key].name), Object.keys(APP.data.armor));
    APP.populateSelect('gun_mark', Object.keys(APP.data.armaments.gun_marks).map(key => APP.data.armaments.gun_marks[key].name), Object.keys(APP.data.armaments.gun_marks));
    APP.populateSelect('torpedo_mark', Object.keys(APP.data.armaments.torpedo_marks).map(key => APP.data.armaments.torpedo_marks[key].name), Object.keys(APP.data.armaments.torpedo_marks));
    APP.populateSelect('aa_gun_type', Object.keys(APP.data.armaments.aa_guns).map(key => APP.data.armaments.aa_guns[key].name), Object.keys(APP.data.armaments.aa_guns)); 
    
    // Novos seletores de armamento
    APP.populateSelect('shell_size_type', Object.keys(APP.data.armaments.shell_size).map(key => APP.data.armaments.shell_size[key].name), Object.keys(APP.data.armaments.shell_size));
    APP.populateSelect('propellant_type', Object.keys(APP.data.armaments.propellant).map(key => APP.data.armaments.propellant[key].name), Object.keys(APP.data.armaments.propellant));
    APP.populateSelect('bursting_charge_type', Object.keys(APP.data.armaments.bursting_charge).map(key => APP.data.armaments.bursting_charge[key].name), Object.keys(APP.data.armaments.bursting_charge));
    APP.populateSelect('turret_traverse_type', Object.keys(APP.data.armaments.turret_traverse).map(key => APP.data.armaments.turret_traverse[key].name), Object.keys(APP.data.armaments.turret_traverse));
    APP.populateSelect('reloading_method_type', Object.keys(APP.data.armaments.reloading_method).map(key => APP.data.armaments.reloading_method[key].name), Object.keys(APP.data.armaments.reloading_method));


    APP.setupComponentSelectors();
    APP.addEventListeners();
    APP.updateInitialDescriptions(); // Adiciona chamadas para atualizar as descrições iniciais

    // Garante que os valores padrão dos novos seletores de armamento sejam aplicados
    APP.state.components.shell_size = APP.state.components.shell_size || Object.keys(APP.data.armaments.shell_size)[0];
    APP.state.components.propellant = APP.state.components.propellant || Object.keys(APP.data.armaments.propellant)[0];
    APP.state.components.bursting_charge = APP.state.components.bursting_charge || Object.keys(APP.data.armaments.bursting_charge)[0];
    APP.state.components.turret_traverse = APP.state.components.turret_traverse || Object.keys(APP.data.armaments.turret_traverse)[0];
    APP.state.components.reloading_method = APP.state.components.reloading_method || Object.keys(APP.data.armaments.reloading_method)[0];

    document.getElementById('shell_size_type').value = APP.state.components.shell_size;
    document.getElementById('propellant_type').value = APP.state.components.propellant;
    document.getElementById('bursting_charge_type').value = APP.state.components.bursting_charge;
    document.getElementById('turret_traverse_type').value = APP.state.components.turret_traverse;
    document.getElementById('reloading_method_type').value = APP.state.components.reloading_method;
};

APP.setupComponentSelectors = () => {
    const protectionContainer = document.getElementById('protection_components');
    const fireControlContainer = document.getElementById('fire_control_components');
    const sensorsContainer = document.getElementById('sensors_components');
    
    protectionContainer.innerHTML = APP.createComponentSelectorsHTML(APP.data.components.protection);
    fireControlContainer.innerHTML = APP.createComponentSelectorsHTML(APP.data.components.fire_control);
    sensorsContainer.innerHTML = APP.createComponentSelectorsHTML(APP.data.components.sensors);
};

APP.createComponentSelectorsHTML = (category) => {
    let html = `<h4 class="component-category-title"><i class="fas ${category.icon} mr-2"></i>${category.title}</h4>`;
    for (const key in category.options) {
        const option = category.options[key];
        html += `<div class="form-group"><label for="comp_${key}">${option.name}</label><select id="comp_${key}" data-category="${category.title.toLowerCase().replace(/ /g, '_')}" data-key="${key}" class="input-style">`;
        for (const subKey in option.options) {
            html += `<option value="${subKey}">${option.options[subKey].name}</option>`;
        }
        html += `</select><p class="text-xs text-gray-500 mt-1" id="comp_${key}_description">${option.options[Object.keys(option.options)[0]].description}</p></div>`; // Descrição inicial
    }
    return html;
};

APP.addEventListeners = () => {
    document.getElementById('ship_name').addEventListener('input', e => { APP.state.shipName = e.target.value; APP.updateCalculations(); });
    document.getElementById('country').addEventListener('change', e => { 
        APP.state.country = e.target.value; 
        APP.updateCalculations(); 
        APP.updateDescription('country_description', APP.data.countries[e.target.value]?.description || '');
    });
    document.getElementById('naval_doctrine').addEventListener('change', e => { 
        APP.state.doctrine = e.target.value; 
        APP.updateCalculations(); 
        APP.updateDescription('naval_doctrine_description', APP.data.doctrines[e.target.value]?.description || '');
    });
    
    document.getElementById('hull_type').addEventListener('change', e => { 
        APP.state.hull = e.target.value; 
        APP.updateDescription('hull_type_description', APP.data.hulls[e.target.value]?.description || '');

        // Atualiza o limite máximo do slider de velocidade com base no casco
        const hullData = APP.data.hulls[APP.state.hull];
        const speedSlider = document.getElementById('speed_slider');
        if (hullData) {
            speedSlider.max = hullData.max_speed;
            if (APP.state.sliders.speed > hullData.max_speed) {
                APP.state.sliders.speed = hullData.max_speed;
                speedSlider.value = hullData.max_speed;
            }
            // Define valores padrão para os novos seletores se não estiverem definidos
            APP.state.fuel_type = APP.state.fuel_type || Object.keys(APP.data.fuels)[0];
            APP.state.boiler_type = APP.state.boiler_type || Object.keys(APP.data.boilers)[0];
            APP.state.main_engine_type = APP.state.main_engine_type || Object.keys(APP.data.main_engines)[0];
            APP.state.auxiliary_engine_type = APP.state.auxiliary_engine_type || 'none';
            APP.state.propeller_type = APP.state.propeller_type || Object.keys(APP.data.propellers)[0];
            APP.state.steering_mechanism_type = APP.state.steering_mechanism_type || Object.keys(APP.data.steering_mechanism)[0];

            // Atualiza a UI dos novos seletores
            document.getElementById('fuel_type').value = APP.state.fuel_type;
            document.getElementById('boiler_type').value = APP.state.boiler_type;
            document.getElementById('main_engine_type').value = APP.state.main_engine_type;
            document.getElementById('auxiliary_engine_type').value = APP.state.auxiliary_engine_type;
            document.getElementById('propeller_type').value = APP.state.propeller_type;
            document.getElementById('steering_mechanism_type').value = APP.state.steering_mechanism_type;

            // Define os limites para o número de motores/caldeiras
            document.getElementById('number_of_boilers').min = hullData.min_boiler_slots;
            document.getElementById('number_of_boilers').max = hullData.max_boiler_slots;
            document.getElementById('number_of_main_engines').min = hullData.min_engine_slots;
            document.getElementById('number_of_main_engines').max = hullData.max_engine_slots;
            
            // Garante que os valores atuais estejam dentro dos novos limites
            if (APP.state.number_of_boilers < hullData.min_boiler_slots) APP.state.number_of_boilers = hullData.min_boiler_slots;
            if (APP.state.number_of_boilers > hullData.max_boiler_slots) APP.state.number_of_boilers = hullData.max_boiler_slots;
            if (APP.state.number_of_main_engines < hullData.min_engine_slots) APP.state.number_of_main_engines = hullData.min_engine_slots;
            if (APP.state.number_of_main_engines > hullData.max_engine_slots) APP.state.number_of_main_engines = hullData.max_engine_slots;
            
            document.getElementById('number_of_boilers').value = APP.state.number_of_boilers;
            document.getElementById('number_of_main_engines').value = APP.state.number_of_main_engines;

            APP.updateDescription('fuel_type_description', APP.data.fuels[APP.state.fuel_type]?.description || '');
            APP.updateDescription('boiler_type_description', APP.data.boilers[APP.state.boiler_type]?.description || '');
            APP.updateDescription('main_engine_type_description', APP.data.main_engines[APP.state.main_engine_type]?.description || '');
            APP.updateDescription('auxiliary_engine_type_description', APP.data.auxiliaries[APP.state.auxiliary_engine_type]?.description || '');
            APP.updateDescription('propeller_type_description', APP.data.propellers[APP.state.propeller_type]?.description || '');
            APP.updateDescription('steering_mechanism_type_description', APP.data.steering_mechanism[APP.state.steering_mechanism_type]?.description || '');


        } else {
            speedSlider.max = 45; // Valor padrão se nenhum casco for selecionado
        }
        APP.updateCalculations(); 
    });

    // Event listeners para os novos campos de propulsão
    document.getElementById('fuel_type').addEventListener('change', e => { 
        APP.state.fuel_type = e.target.value; 
        APP.updateDescription('fuel_type_description', APP.data.fuels[e.target.value].description);
        APP.updateCalculations(); 
    });
    document.getElementById('boiler_type').addEventListener('change', e => { 
        APP.state.boiler_type = e.target.value; 
        APP.updateDescription('boiler_type_description', APP.data.boilers[e.target.value].description);
        APP.updateCalculations(); 
    });
    document.getElementById('number_of_boilers').addEventListener('input', e => { 
        let val = parseInt(e.target.value) || 0;
        const hullData = APP.data.hulls[APP.state.hull];
        if (hullData) {
            val = Math.max(hullData.min_boiler_slots, Math.min(val, hullData.max_boiler_slots));
        }
        APP.state.number_of_boilers = val; 
        e.target.value = val; // Atualiza o campo com o valor corrigido
        APP.updateCalculations(); 
    });
    document.getElementById('main_engine_type').addEventListener('change', e => { 
        APP.state.main_engine_type = e.target.value; 
        APP.updateDescription('main_engine_type_description', APP.data.main_engines[e.target.value].description);
        APP.updateCalculations(); 
    });
    document.getElementById('number_of_main_engines').addEventListener('input', e => { 
        let val = parseInt(e.target.value) || 0;
        const hullData = APP.data.hulls[APP.state.hull];
        if (hullData) {
            val = Math.max(hullData.min_engine_slots, Math.min(val, hullData.max_engine_slots));
        }
        APP.state.number_of_main_engines = val; 
        e.target.value = val; // Atualiza o campo com o valor corrigido
        APP.updateCalculations(); 
    });
    document.getElementById('auxiliary_engine_type').addEventListener('change', e => { 
        APP.state.auxiliary_engine_type = e.target.value; 
        APP.updateDescription('auxiliary_engine_type_description', APP.data.auxiliaries[e.target.value].description);
        APP.updateCalculations(); 
    });
    document.getElementById('propeller_type').addEventListener('change', e => { 
        APP.state.propeller_type = e.target.value; 
        APP.updateDescription('propeller_type_description', APP.data.propellers[e.target.value].description);
        APP.updateCalculations(); 
    });
    document.getElementById('steering_mechanism_type').addEventListener('change', e => { 
        APP.state.steering_mechanism_type = e.target.value; 
        APP.updateDescription('steering_mechanism_type_description', APP.data.steering_mechanism[e.target.value].description);
        APP.updateCalculations(); 
    });

    document.getElementById('armor_type').addEventListener('change', e => { 
        APP.state.armor.type = e.target.value; 
        APP.updateDescription('armor_type_description', APP.data.armor[e.target.value].description);
        APP.updateCalculations(); 
    });
    document.getElementById('armor_thickness').addEventListener('input', e => { APP.state.armor.thickness = parseInt(e.target.value) || 0; APP.updateCalculations(); });
    
    document.getElementById('displacement_slider').addEventListener('input', e => { APP.state.sliders.displacement = parseInt(e.target.value); APP.updateCalculations(); });
    document.getElementById('speed_slider').addEventListener('input', e => { 
        const hullData = APP.data.hulls[APP.state.hull];
        let newSpeed = parseInt(e.target.value);
        if (hullData && newSpeed > hullData.max_speed) {
            newSpeed = hullData.max_speed; // Limita a velocidade ao máximo do casco
            e.target.value = newSpeed; // Atualiza o slider visualmente
        }
        APP.state.sliders.speed = newSpeed; 
        APP.updateCalculations(); 
    });
    document.getElementById('range_slider').addEventListener('input', e => { APP.state.sliders.range = parseInt(e.target.value); APP.updateCalculations(); });

    document.getElementById('add_gun_button').addEventListener('click', APP.addGun);
    document.getElementById('add_torpedo_button').addEventListener('click', APP.addTorpedo);
    document.getElementById('add_aa_gun_button').addEventListener('click', APP.addAAGun); 
    document.getElementById('save_design_button').addEventListener('click', APP.saveAndShowSheet);
    document.getElementById('export_design_button').addEventListener('click', APP.exportDesign);
    document.getElementById('import_design_button').addEventListener('click', APP.importDesign);
    
    document.getElementById('gun_mark').addEventListener('change', e => {
        APP.updateDescription('gun_mark_description', APP.data.armaments.gun_marks[e.target.value]?.description || '');
    });
    document.getElementById('torpedo_mark').addEventListener('change', e => {
        APP.updateDescription('torpedo_mark_description', APP.data.armaments.torpedo_marks[e.target.value]?.description || '');
    });
    document.getElementById('aa_gun_type').addEventListener('change', e => {
        APP.updateDescription('aa_gun_type_description', APP.data.armaments.aa_guns[e.target.value]?.description || '');
    });

    // Event listeners para os novos seletores de armamento
    document.getElementById('shell_size_type').addEventListener('change', e => {
        APP.state.components.shell_size = e.target.value;
        APP.updateDescription('shell_size_type_description', APP.data.armaments.shell_size[e.target.value]?.description || '');
        APP.updateCalculations();
    });
    document.getElementById('propellant_type').addEventListener('change', e => {
        APP.state.components.propellant = e.target.value;
        APP.updateDescription('propellant_type_description', APP.data.armaments.propellant[e.target.value]?.description || '');
        APP.updateCalculations();
    });
    document.getElementById('bursting_charge_type').addEventListener('change', e => {
        APP.state.components.bursting_charge = e.target.value;
        APP.updateDescription('bursting_charge_type_description', APP.data.armaments.bursting_charge[e.target.value]?.description || '');
        APP.updateCalculations();
    });
    document.getElementById('turret_traverse_type').addEventListener('change', e => {
        APP.state.components.turret_traverse = e.target.value;
        APP.updateDescription('turret_traverse_type_description', APP.data.armaments.turret_traverse[e.target.value]?.description || '');
        APP.updateCalculations();
    });
    document.getElementById('reloading_method_type').addEventListener('change', e => {
        APP.state.components.reloading_method = e.target.value;
        APP.updateDescription('reloading_method_type_description', APP.data.armaments.reloading_method[e.target.value]?.description || '');
        APP.updateCalculations();
    });


    document.querySelectorAll('[id^="comp_"]').forEach(select => {
        select.addEventListener('change', e => {
            const key = e.target.dataset.key;
            const value = e.target.value;
            APP.state.components[key] = value;
            // Atualiza a descrição do componente
            const categoryKey = Object.keys(APP.data.components).find(cKey => APP.data.components[cKey].options[key]);
            if (categoryKey) {
                const description = APP.data.components[categoryKey].options[key].options[value].description;
                APP.updateDescription(`comp_${key}_description`, description);
            }
            APP.updateCalculations();
        });
    });
};

APP.populateSelect = (selectId, options, values = options) => {
    const select = document.getElementById(selectId);
    if (!select) {
        console.error(`Elemento select com ID '${selectId}' não encontrado.`);
        return;
    }
    select.innerHTML = `<option value="">Selecione...</option>`;
    options.forEach((option, index) => {
        select.innerHTML += `<option value="${values[index]}">${option}</option>`;
    });
};

APP.updateDescription = (elementId, description) => {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = description;
    }
};

APP.updateInitialDescriptions = () => {
    // Atualiza as descrições dos seletores que já têm um valor padrão ou que precisam de descrição inicial
    if (APP.state.hull) {
        APP.updateDescription('hull_type_description', APP.data.hulls[APP.state.hull]?.description || '');
    }
    if (APP.state.fuel_type) {
        APP.updateDescription('fuel_type_description', APP.data.fuels[APP.state.fuel_type]?.description || '');
    }
    if (APP.state.boiler_type) {
        APP.updateDescription('boiler_type_description', APP.data.boilers[APP.state.boiler_type]?.description || '');
    }
    if (APP.state.main_engine_type) {
        APP.updateDescription('main_engine_type_description', APP.data.main_engines[APP.state.main_engine_type]?.description || '');
    }
    if (APP.state.auxiliary_engine_type) {
        APP.updateDescription('auxiliary_engine_type_description', APP.data.auxiliaries[APP.state.auxiliary_engine_type]?.description || '');
    }
    if (APP.state.propeller_type) {
        APP.updateDescription('propeller_type_description', APP.data.propellers[APP.state.propeller_type]?.description || '');
    }
    if (APP.state.steering_mechanism_type) {
        APP.updateDescription('steering_mechanism_type_description', APP.data.steering_mechanism[APP.state.steering_mechanism_type]?.description || '');
    }
    if (APP.state.armor.type) {
        APP.updateDescription('armor_type_description', APP.data.armor[APP.state.armor.type]?.description || '');
    }
    // Descrições para os novos seletores de armamento
    if (APP.state.components.shell_size) {
        APP.updateDescription('shell_size_type_description', APP.data.armaments.shell_size[APP.state.components.shell_size]?.description || '');
    }
    if (APP.state.components.propellant) {
        APP.updateDescription('propellant_type_description', APP.data.armaments.propellant[APP.state.components.propellant]?.description || '');
    }
    if (APP.state.components.bursting_charge) {
        APP.updateDescription('bursting_charge_type_description', APP.data.armaments.bursting_charge[APP.state.components.bursting_charge]?.description || '');
    }
    if (APP.state.components.turret_traverse) {
        APP.updateDescription('turret_traverse_type_description', APP.data.armaments.turret_traverse[APP.state.components.turret_traverse]?.description || '');
    }
    if (APP.state.components.reloading_method) {
        APP.updateDescription('reloading_method_type_description', APP.data.armaments.reloading_method[APP.state.components.reloading_method]?.description || '');
    }

    if (APP.state.armaments.length > 0) {
        if (document.getElementById('gun_mark').value) {
            APP.updateDescription('gun_mark_description', APP.data.armaments.gun_marks[document.getElementById('gun_mark').value]?.description || '');
        }
        if (document.getElementById('torpedo_mark').value) {
            APP.updateDescription('torpedo_mark_description', APP.data.armaments.torpedo_marks[document.getElementById('torpedo_mark').value]?.description || '');
        }
        if (document.getElementById('aa_gun_type').value) {
            APP.updateDescription('aa_gun_type_description', APP.data.armaments.aa_guns[document.getElementById('aa_gun_type').value]?.description || '');
        }
    }
     // Para componentes, as descrições iniciais são definidas em createComponentSelectorsHTML, mas podem ser atualizadas aqui se o estado já tiver valores
    for (const categoryKey in APP.data.components) {
        for (const compKey in APP.data.components[categoryKey].options) {
            const selectElement = document.getElementById(`comp_${compKey}`);
            if (selectElement && APP.state.components[compKey]) {
                const description = APP.data.components[categoryKey].options[compKey].options[APP.state.components[compKey]]?.description;
                if (description) {
                    APP.updateDescription(`comp_${compKey}_description`, description);
                }
            }
        }
    }
};


// =================================================================================
// LÓGICA DE MANIPULAÇÃO DE ESTADO
// =================================================================================

APP.addGun = () => {
    const caliber = parseInt(document.getElementById('gun_caliber').value);
    const turrets = parseInt(document.getElementById('gun_turrets').value);
    const barrels = parseInt(document.getElementById('gun_barrels').value);
    const mark = document.getElementById('gun_mark').value;
    // Novos componentes de armamento para o estado
    // REMOVIDOS shellBallisticsHe e shellBallisticsAp
    const shellSize = document.getElementById('shell_size_type').value;
    const propellant = document.getElementById('propellant_type').value;
    const burstingCharge = document.getElementById('bursting_charge_type').value;
    const turretTraverse = document.getElementById('turret_traverse_type').value;
    const reloadingMethod = document.getElementById('reloading_method_type').value;


    if (!caliber || !turrets || !barrels || !mark || !shellSize || !propellant || !burstingCharge || !turretTraverse || !reloadingMethod) { 
        APP.showAlert("Preencha todos os campos da torre e seus componentes de munição/operação."); 
        return; 
    }
    APP.state.armaments.push({ 
        id: `gun_${Date.now()}`, 
        type: 'gun_turret', 
        caliber, 
        turrets, 
        barrels, 
        mark,
        // REMOVIDOS shellBallisticsHe e shellBallisticsAp
        shellSize,
        propellant,
        burstingCharge,
        turretTraverse,
        reloadingMethod
    });
    APP.updateCalculations();
};

APP.addTorpedo = () => {
    const tubes = parseInt(document.getElementById('torpedo_tubes').value);
    const mark = document.getElementById('torpedo_mark').value;
    if (!tubes || !mark) { APP.showAlert("Preencha todos os campos do lançador."); return; }
    APP.state.armaments.push({ id: `torpedo_${Date.now()}`, type: 'torpedo_launcher', tubes, mark });
    APP.updateCalculations();
};

APP.addAAGun = () => { 
    const aaType = document.getElementById('aa_gun_type').value;
    const quantity = parseInt(document.getElementById('aa_gun_quantity').value);
    if (!aaType || !quantity || quantity <= 0) { APP.showAlert("Selecione o tipo e a quantidade de armas antiaéreas."); return; }
    APP.state.armaments.push({ id: `aa_${Date.now()}`, type: 'aa_gun', aaType, quantity });
    APP.updateCalculations();
};

APP.removeArmament = (armamentId) => {
    APP.state.armaments = APP.state.armaments.filter(arm => arm.id !== armamentId);
    APP.updateCalculations();
};

// =================================================================================
// CÁLCULO PRINCIPAL (BALANCEAMENTO V10)
// =================================================================================

APP.getCalculatedTotals = () => {
    if (!APP.state.hull) { return null; }
    const hullData = APP.data.hulls[APP.state.hull];
    if (!hullData) return null;

    // Obter dados dos componentes de propulsão selecionados
    const fuelData = APP.data.fuels[APP.state.fuel_type];
    const boilerData = APP.data.boilers[APP.state.boiler_type];
    const mainEngineData = APP.data.main_engines[APP.state.main_engine_type];
    const auxiliaryData = APP.data.auxiliaries[APP.state.auxiliary_engine_type];
    const propellerData = APP.data.propellers[APP.state.propeller_type];
    const steeringData = APP.data.steering_mechanism[APP.state.steering_mechanism_type];

    const displacementMultiplier = APP.state.sliders.displacement / 100;
    let modifiedTonnage = hullData.base_tonnage * displacementMultiplier;
    // Custo base do casco já foi dividido por 4 na definição de dados
    let modifiedCost = hullData.base_cost * Math.pow(displacementMultiplier, 1.5); 
    const modifiedSlots = {
        armament: Math.floor((hullData.slots.main_armament + (hullData.slots.secondary_armament || 0)) * displacementMultiplier),
        utility: Math.floor(hullData.slots.utility * displacementMultiplier)
    };

    let total = {
        cost: modifiedCost,
        tonnage: modifiedTonnage,
        power_gen: 0,
        power_draw: 0,
        slots_armament: { used: 0, max: modifiedSlots.armament },
        slots_utility: { used: 0, max: modifiedSlots.utility },
        reliability_mod: 1.0,
        accuracy_mod: 1.0,
        stability: 100, 
        maneuverability: hullData.base_maneuverability, 
        firepower: 0,
        aa_rating: 0, 
        asw_rating: 0,
        finalSpeed: 0,
        finalRange: 0,
        finalReliability: 0,
        finalStability: 0,
        finalAccuracy: 0,
        finalFirepower: 0,
        finalManeuverability: 0,
        engineName: 'N/A', 
        fuelName: 'N/A',
        boilerName: 'N/A',
        propellerName: 'N/A',
        steeringName: 'N/A',
        auxiliaryName: 'N/A',
        // Novos modificadores para armamentos
        shell_damage_mod: 1.0,
        shell_penetration_mod: 1.0,
        shell_accuracy_mod: 1.0,
        shell_weight_mod: 1.0,
        shell_muzzle_velocity_mod: 1.0,
        flash_fire_chance_mod: 1.0,
        reload_speed_mod: 1.0,
        traverse_speed_mod: 1.0
    };

    // Aplicar modificadores de doutrina naval
    if (APP.state.doctrine && APP.data.doctrines[APP.state.doctrine]) {
        const doctrine = APP.data.doctrines[APP.state.doctrine];
        total.cost *= doctrine.cost_modifier || 1.0;
        if (doctrine.performance_bonus) {
            if (doctrine.performance_bonus.all) {
                total.reliability_mod *= doctrine.performance_bonus.all;
                total.accuracy_mod *= doctrine.performance_bonus.all;
                total.stability *= doctrine.performance_bonus.all;
                total.maneuverability *= doctrine.performance_bonus.all;
            }
            if (doctrine.performance_bonus.firepower) total.firepower_mod = (total.firepower_mod || 1.0) * doctrine.performance_bonus.firepower;
            if (doctrine.performance_bonus.armor) total.armor_mod = (total.armor_mod || 1.0) * doctrine.performance_bonus.armor;
            if (doctrine.performance_bonus.asw) total.asw_mod = (total.asw_mod || 1.0) * doctrine.performance_bonus.asw;
            if (doctrine.performance_bonus.aa) total.aa_mod = (total.aa_mod || 1.0) * doctrine.performance_bonus.aa;
        }
    }


    // CÁLCULOS DE PROPULSÃO
    if (fuelData) {
        total.cost *= fuelData.cost_mod;
        total.tonnage *= fuelData.tonnage_mod;
        total.reliability_mod *= fuelData.reliability_mod;
        total.fuelName = fuelData.name;
    }
    
    if (boilerData && APP.state.number_of_boilers > 0) {
        const numBoilers = APP.state.number_of_boilers;
        // Custo da caldeira escalado pelo modificador de deslocamento do casco
        total.cost += boilerData.cost_per_unit * numBoilers * hullData.displacement_mod;
        total.tonnage += boilerData.tonnage_per_unit * numBoilers;
        total.power_gen += boilerData.power_per_unit * numBoilers;
        total.reliability_mod *= boilerData.reliability_mod;
        total.boilerName = `${numBoilers}x ${boilerData.name}`;
    }

    if (mainEngineData && APP.state.number_of_main_engines > 0) {
        const numEngines = APP.state.number_of_main_engines;
        // Custo do motor principal escalado pelo modificador de deslocamento do casco
        total.cost += mainEngineData.cost_per_unit * numEngines * 1.5 * hullData.displacement_mod; 
        total.tonnage += mainEngineData.tonnage_per_unit * numEngines;
        total.power_gen += mainEngineData.base_power_per_unit * numEngines * 0.5; // Multiplicador de potência ajustado (reduzido)
        total.stability += mainEngineData.stability_mod_per_unit * numEngines;
        total.maneuverability += mainEngineData.maneuverability_mod_per_unit * numEngines;
        total.engineName = `${numEngines}x ${mainEngineData.name}`;
    }

    if (auxiliaryData && auxiliaryData.name !== "none") { 
        // Custo do auxiliar escalado pelo modificador de deslocamento do casco
        total.cost += auxiliaryData.cost * hullData.displacement_mod; 
        total.tonnage += auxiliaryData.tonnage;
        total.power_gen += auxiliaryData.power_add;
        total.reliability_mod *= auxiliaryData.reliability_mod;
        total.maneuverability *= auxiliaryData.maneuverability_mod;
        total.slots_utility.used += auxiliaryData.slots_required;
        total.auxiliaryName = auxiliaryData.name;
    }

    if (propellerData) {
        total.cost *= propellerData.cost_mod; // cost_mod já é um multiplicador
        total.tonnage += (hullData.base_tonnage * propellerData.tonnage_mod_factor); 
        total.stability += propellerData.stability_mod;
        total.maneuverability *= propellerData.maneuverability_mod;
        total.power_gen *= propellerData.efficiency; 
        total.propellerName = propellerData.name;
    }

    if (steeringData) {
        // Custo do mecanismo de direção escalado pelo modificador de deslocamento do casco
        total.cost += steeringData.cost * hullData.displacement_mod; 
        total.tonnage += steeringData.tonnage;
        total.reliability_mod *= steeringData.reliability_mod;
        total.stability += steeringData.stability_mod;
        total.maneuverability *= steeringData.maneuverability_mod;
        total.steeringName = steeringData.name;
    }

    // Impacto do combustível na potência total
    if (fuelData) {
        total.power_gen *= fuelData.power_mod;
    }

    // Cálculo da Velocidade Final
    const targetSpeed = APP.state.sliders.speed;
    const maxSpeedHull = hullData.max_speed;
    const effectiveTargetSpeed = Math.min(targetSpeed, maxSpeedHull); 

    const dragCoefficient = total.tonnage / 1000; 
    const requiredPower = dragCoefficient * Math.pow(effectiveTargetSpeed, 3) * 0.0001; 

    if (total.power_gen >= requiredPower && effectiveTargetSpeed > 0) {
        total.finalSpeed = effectiveTargetSpeed;
    } else if (total.power_gen > 0) {
        total.finalSpeed = Math.min(maxSpeedHull, Math.pow(total.power_gen / dragCoefficient / 0.0001, 1/3));
    } else {
        total.finalSpeed = 0;
    }

    // Cálculo do Alcance Final
    const baseFuelConsumptionPerKmPerTon = 0.00001; 
    const desiredRange = APP.state.sliders.range;
    const fuelTonnageForRange = (desiredRange * baseFuelConsumptionPerKmPerTon * total.tonnage) / (fuelData ? fuelData.range_factor : 1.0);
    // Custo do combustível por tonelada dividido por 4
    const fuelCostForRange = fuelTonnageForRange * 12500; 

    total.tonnage += fuelTonnageForRange;
    total.cost += fuelCostForRange;
    total.finalRange = desiredRange; 

    // Penalidade de manobrabilidade por tonelagem excessiva ou navio muito grande
    total.maneuverability -= (total.tonnage / 1000) * 0.3; 
    total.maneuverability = Math.max(0, Math.min(100, total.maneuverability)); 

    // CÁLCULOS EXISTENTES (mantidos e ajustados)
    if (APP.state.armor.type !== 'none' && APP.state.armor.thickness > 0) {
        const armorData = APP.data.armor[APP.state.armor.type];
        const surfaceAreaProxy = Math.pow(modifiedTonnage, 0.667);
        // cost_per_mm_ton já foi dividido por 4
        const armorTonnage = armorData.tonnage_per_mm_ton * APP.state.armor.thickness * (surfaceAreaProxy / 150);
        total.cost += (armorData.cost_per_mm_ton * APP.state.armor.thickness * (surfaceAreaProxy / 150)) * hullData.displacement_mod;
        total.tonnage += armorTonnage;
        total.stability -= (armorTonnage / 1000); 
    }
    
    for (const key in APP.state.components) {
        const categoryKey = Object.keys(APP.data.components).find(cKey => APP.data.components[cKey].options[key]);
        if (categoryKey) {
            const compData = APP.data.components[categoryKey].options[key].options[APP.state.components[key]];
            if(compData) {
                // Custo do componente já foi dividido por 4 e escalado pelo displacement_mod
                total.cost += (compData.cost || 0) * hullData.displacement_mod; 
                total.tonnage += compData.tonnage || 0;
                total.power_draw += compData.power_draw || 0;
                total.slots_utility.used += compData.slots || 0;
                if (compData.reliability_mod) total.reliability_mod *= compData.reliability_mod;
                if (compData.accuracy_mod) total.accuracy_mod *= compData.accuracy_mod;
                if (compData.stability_mod) total.stability += compData.stability_mod;
                if (compData.maneuverability_mod) total.maneuverability *= compData.maneuverability_mod;
            }
        }
    }

    APP.state.armaments.forEach(arm => {
        if (arm.type === 'gun_turret') {
            const markData = APP.data.armaments.gun_marks[arm.mark];
            const base = APP.data.armaments.base_values.gun;
            const totalGuns = arm.turrets * arm.barrels;
            const gunTonnage = base.tonnage_per_mm * arm.caliber * totalGuns * markData.tonnage_mod;
            // Custo do canhão já foi dividido por 4 e escalado pelo displacement_mod
            total.cost += (base.cost_per_mm * arm.caliber * totalGuns * markData.cost_mod) * hullData.displacement_mod;
            total.tonnage += gunTonnage;
            total.power_draw += base.power_draw_per_mm * arm.caliber * totalGuns * markData.power_mod;
            total.slots_armament.used += base.slots_per_turret * arm.turrets * markData.slots_mod;
            total.firepower += base.firepower_per_mm * arm.caliber * totalGuns;
            total.stability -= gunTonnage * base.stability_penalty_per_ton;

            // Aplica modificadores dos novos componentes de armamento
            const shellSizeData = APP.data.armaments.shell_size[arm.shellSize];
            const propellantData = APP.data.armaments.propellant[arm.propellant];
            const burstingChargeData = APP.data.armaments.bursting_charge[arm.burstingCharge];
            const turretTraverseData = APP.data.armaments.turret_traverse[arm.turretTraverse];
            const reloadingMethodData = APP.data.armaments.reloading_method[arm.reloadingMethod];

            // Acumula os modificadores
            // Os modificadores de dano e penetração das balísticas foram removidos, então eles não são aplicados aqui
            if (shellSizeData) {
                total.shell_damage_mod *= shellSizeData.damage_mod || 1.0;
                total.shell_penetration_mod *= shellSizeData.penetration_mod || 1.0;
                total.shell_weight_mod *= shellSizeData.tonnage_mod || 1.0; // Usar tonnage_mod para peso da munição
                total.firepower *= shellSizeData.firepower_mod || 1.0; // Afeta cadência/poder de fogo
                total.cost += (shellSizeData.cost_mod || 0) * hullData.displacement_mod;
            }
            if (propellantData) {
                total.shell_muzzle_velocity_mod *= propellantData.power_mod || 1.0; // Power_mod do propelente afeta velocidade de saída
                total.flash_fire_chance_mod *= propellantData.flash_fire_chance_mod || 1.0;
                total.cost += (propellantData.cost_mod || 0) * hullData.displacement_mod;
            }
            if (burstingChargeData) {
                total.shell_damage_mod *= burstingChargeData.damage_mod || 1.0;
                total.flash_fire_chance_mod *= burstingChargeData.flash_fire_chance_mod || 1.0;
                total.cost += (burstingChargeData.cost_mod || 0) * hullData.displacement_mod;
            }
            if (turretTraverseData) {
                total.traverse_speed_mod *= turretTraverseData.traverse_speed_mod || 1.0;
                total.power_draw += (turretTraverseData.power_draw_mod || 0) * hullData.displacement_mod;
                total.reliability_mod *= turretTraverseData.reliability_mod || 1.0;
                total.cost += (turretTraverseData.cost_mod || 0) * hullData.displacement_mod;
            }
            if (reloadingMethodData) {
                total.reload_speed_mod *= reloadingMethodData.reload_speed_mod || 1.0;
                total.power_draw += (reloadingMethodData.power_draw_mod || 0) * hullData.displacement_mod;
                total.reliability_mod *= reloadingMethodData.reliability_mod || 1.0;
                total.cost += (reloadingMethodData.cost_mod || 0) * hullData.displacement_mod;
            }

            // Aplica os modificadores acumulados ao firepower, accuracy, etc.
            total.firepower *= total.shell_damage_mod * total.shell_muzzle_velocity_mod * total.reload_speed_mod;
            total.accuracy_mod *= total.shell_accuracy_mod;
            // Tonelagem da munição é separada e adicionada ao total de tonelagem
            total.tonnage += (base.tonnage_per_mm * arm.caliber * totalGuns * total.shell_weight_mod) * markData.tonnage_mod;


        } else if (arm.type === 'torpedo_launcher') {
            const markData = APP.data.armaments.torpedo_marks[arm.mark];
            const base = APP.data.armaments.base_values.torpedo;
            // Custo do torpedo já foi dividido por 4 e escalado pelo displacement_mod
            total.cost += (base.cost_per_tube * arm.tubes * markData.cost_mod) * hullData.displacement_mod;
            total.tonnage += base.tonnage_per_tube * arm.tubes * markData.tonnage_mod;
            total.power_draw += base.power_draw_per_tube * arm.tubes * markData.power_mod;
            total.slots_armament.used += base.slots_per_launcher * markData.slots_mod;
            total.firepower += markData.damage_mod * 50 * arm.tubes;
        } else if (arm.type === 'aa_gun') { 
            const aaData = APP.data.armaments.aa_guns[arm.aaType];
            // Custo da arma AA já foi dividido por 4 e escalado pelo displacement_mod
            total.cost += (aaData.cost_per_unit * arm.quantity) * hullData.displacement_mod;
            total.tonnage += aaData.tonnage_per_unit * arm.quantity;
            total.power_draw += aaData.power_draw_per_unit * arm.quantity;
            total.aa_rating += aaData.aa_rating_per_unit * arm.quantity;
            total.slots_armament.used += aaData.slots_per_unit * arm.quantity;
        }
    });

    // Finalizar cálculos de estatísticas
    total.finalReliability = Math.min(100, Math.max(0, 100 * total.reliability_mod));
    total.finalStability = Math.max(0, Math.min(100, Math.round(total.stability)));
    total.finalAccuracy = Math.round(100 * total.accuracy_mod * (total.finalStability / 100)); 
    total.finalFirepower = Math.round(total.firepower * (total.firepower_mod || 1.0));
    total.finalManeuverability = Math.max(0, Math.min(100, Math.round(total.maneuverability))); 

    total.maxTonnage = hullData.base_tonnage * (APP.state.sliders.displacement / 100) * 1.5; 

    return total;
}

APP.updateCalculations = () => {
    const totals = APP.getCalculatedTotals();
    if (totals) {
        APP.updateUi(totals);
    }
};

// =================================================================================
// ATUALIZAÇÃO DA UI
// =================================================================================

APP.updateUi = (totals) => {
    const hullData = APP.data.hulls[APP.state.hull];
    if (!hullData) return;

    document.getElementById('displacement_value_label').textContent = `${APP.state.sliders.displacement}%`;
    document.getElementById('speed_value_label').textContent = `${APP.state.sliders.speed} nós`; 
    document.getElementById('range_value_label').textContent = `${APP.state.sliders.range.toLocaleString('pt-BR')} km`;

    document.getElementById('display_name').textContent = APP.state.shipName || "Novo Projeto";
    document.getElementById('display_class').textContent = hullData.name;
    document.getElementById('display_cost').textContent = `£${Math.round(totals.cost).toLocaleString('pt-BR')}`;
    document.getElementById('display_speed').textContent = `${totals.finalSpeed.toFixed(1)} nós`; 
    document.getElementById('display_reliability').textContent = `${Math.round(totals.finalReliability)}%`;
    document.getElementById('display_stability').textContent = `${totals.finalStability}%`;
    document.getElementById('display_accuracy').textContent = `${totals.finalAccuracy}%`;
    document.getElementById('display_maneuverability').textContent = `${totals.finalManeuverability}%`; 

    APP.updateProgressBar('tonnage', totals.tonnage, totals.maxTonnage);
    APP.updateProgressBar('armament_slots', totals.slots_armament.used, totals.slots_armament.max);
    APP.updateProgressBar('utility_slots', totals.slots_utility.used, totals.slots_utility.max);
    APP.updateProgressBar('power', totals.power_draw, totals.power_gen);

    const armamentList = document.getElementById('armament_list');
    armamentList.innerHTML = '';
    APP.state.armaments.forEach(arm => {
        let text = '';
        if (arm.type === 'gun_turret') {
            text = `${arm.turrets}x Torre(s) c/ ${arm.barrels} Canhão(s) de ${arm.caliber}mm (${APP.data.armaments.gun_marks[arm.mark].name})`;
            const shellSizeName = APP.data.armaments.shell_size[arm.shellSize]?.name || 'N/A';
            const propellantName = APP.data.armaments.propellant[arm.propellant]?.name || 'N/A';
            const burstingChargeName = APP.data.armaments.bursting_charge[arm.burstingCharge]?.name || 'N/A';
            const turretTraverseName = APP.data.armaments.turret_traverse[arm.turretTraverse]?.name || 'N/A';
            const reloadingMethodName = APP.data.armaments.reloading_method[arm.reloadingMethod]?.name || 'N/A';

            text += `<br>Tamanho Munição: ${shellSizeName}`;
            text += `<br>Propelente: ${propellantName}, Carga Explosiva: ${burstingChargeName}`;
            text += `<br>Virada Torre: ${turretTraverseName}, Recarga: ${reloadingMethodName}`;

        } else if (arm.type === 'torpedo_launcher') {
            text = `1x Lançador c/ ${arm.tubes} Torpedo(s) (${APP.data.armaments.torpedo_marks[arm.mark].name})`;
        } else if (arm.type === 'aa_gun') {
            text = `${arm.quantity}x ${APP.data.armaments.aa_guns[arm.aaType].name}`;
        }
        const div = document.createElement('div');
        div.className = 'item-row';
        div.innerHTML = `<span>${text}</span><button class="btn-danger" onclick="APP.removeArmament('${arm.id}')"><i class="fas fa-trash"></i></button>`;
        armamentList.appendChild(div);
    });

    const statusPanel = document.getElementById('status_panel');
    let warnings = [];
    if (totals.tonnage > totals.maxTonnage) warnings.push("Excesso de peso crítico!");
    if (totals.slots_armament.used > totals.slots_armament.max) warnings.push("Slots de armamento excedidos!");
    if (totals.slots_utility.used > totals.slots_utility.max) warnings.push("Slots de utilidade excedidos!");
    if (totals.power_draw > totals.power_gen) warnings.push("Déficit de energia!");
    if (totals.finalStability < 50) warnings.push("Estabilidade perigosamente baixa!");
    if (totals.finalManeuverability < 30) warnings.push("Manobrabilidade muito baixa!");
    if (totals.finalSpeed < APP.state.sliders.speed * 0.95) warnings.push(`Motor fraco para a velocidade alvo! Velocidade real: ${totals.finalSpeed.toFixed(1)} nós.`);
    if (APP.state.number_of_boilers < hullData.min_boiler_slots || APP.state.number_of_boilers > hullData.max_boiler_slots) {
        warnings.push(`Número de caldeiras (${APP.state.number_of_boilers}) fora do limite do casco (${hullData.min_boiler_slots}-${hullData.max_boiler_slots}).`);
    }
    if (APP.state.number_of_main_engines < hullData.min_engine_slots || APP.state.number_of_main_engines > hullData.max_engine_slots) {
        warnings.push(`Número de motores (${APP.state.number_of_main_engines}) fora do limite do casco (${hullData.min_engine_slots}-${hullData.max_engine_slots}).`);
    }


    statusPanel.className = `status-indicator ${warnings.length > 0 ? 'status-error' : 'status-ok'}`;
    statusPanel.textContent = warnings.length > 0 ? warnings.join(' ') : "Projeto dentro dos parâmetros.";
};

APP.updateProgressBar = (id, current, max) => {
    const display = document.getElementById(`${id}_display`);
    const bar = document.getElementById(`${id}_bar`);
    current = Math.round(current);
    max = Math.round(max);
    display.textContent = `${current.toLocaleString('pt-BR')} / ${max.toLocaleString('pt-BR')}`;
    const percentage = max > 0 ? Math.min((current / max) * 100, 100) : 0;
    bar.style.width = `${percentage}%`;
    bar.style.backgroundColor = current > max ? '#ef4444' : (current > max * 0.85 ? '#f59e0b' : '#3b82f6');
};

APP.showAlert = (message) => {
    const statusPanel = document.getElementById('status_panel');
    statusPanel.className = 'status-indicator status-error';
    statusPanel.textContent = message;
    setTimeout(() => {
        APP.updateCalculations(); // Restaura o status normal após um tempo
    }, 3000);
};

// =================================================================================
// GERENCIAMENTO DE PROJETO
// =================================================================================

APP.saveAndShowSheet = () => {
    if (!APP.state.hull) {
        APP.showAlert("Selecione um casco antes de finalizar o projeto.");
        return;
    }
    const finalData = {
        state: APP.state,
        calculated: APP.getCalculatedTotals(),
        data: {
            hulls: APP.data.hulls,
            doctrines: APP.data.doctrines,
            components: APP.data.components,
            armaments: APP.data.armaments,
            armor: APP.data.armor,
            // Incluir os novos dados de propulsão para a ficha
            fuels: APP.data.fuels,
            boilers: APP.data.boilers,
            main_engines: APP.data.main_engines,
            auxiliaries: APP.data.auxiliaries,
            propellers: APP.data.propellers,
            steering_mechanism: APP.data.steering_mechanism
        }
    };
    
    localStorage.setItem('shipSheetData', JSON.stringify(finalData));
    window.open('ship_sheet.html', '_blank');
};

APP.exportDesign = () => {
    const jsonString = JSON.stringify(APP.state, null, 2);
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(jsonString).then(() => {
            APP.showAlert("Código do projeto copiado para a área de transferência!");
        }).catch(err => {
            console.error('Erro ao copiar texto com navigator.clipboard: ', err);
            APP.fallbackCopyTextToClipboard(jsonString);
        });
    } else {
        APP.fallbackCopyTextToClipboard(jsonString);
    }
};

APP.fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; 
    textArea.style.left = "-9999px";
    textArea.style.top = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'bem-sucedida' : 'mal-sucedida';
        APP.showAlert(`Cópia ${msg} para a área de transferência!`);
    } catch (err) {
        console.error('Erro ao copiar texto com execCommand: ', err);
        prompt("Não foi possível copiar automaticamente. Copie este código:", text);
    }
    document.body.removeChild(textArea);
};


APP.importDesign = () => {
    const jsonString = prompt("Cole o código do projeto aqui:");
    if (jsonString) {
        try {
            const newState = JSON.parse(jsonString);
            APP.loadState(newState);
            APP.showAlert("Projeto importado com sucesso!");
        } catch (error) {
            APP.showAlert("Erro ao ler o código do projeto. Formato inválido.");
            console.error("Erro de importação:", error);
        }
    }
};

APP.loadState = (newState) => {
    APP.state = {
        ...{ 
            shipName: "Novo Projeto Importado",
            country: null, doctrine: null, hull: null,
            fuel_type: null, boiler_type: null, number_of_boilers: 1,
            main_engine_type: null, number_of_main_engines: 1,
            auxiliary_engine_type: 'none', propeller_type: null, steering_mechanism_type: null,
            sliders: { displacement: 100, speed: 25, range: 8000 },
            armor: { type: 'none', thickness: 0 },
            armaments: [],
            components: {
                // Inicializa os novos componentes de armamento com valores padrão
                shell_size: null, // Será definido no setupUi
                propellant: null, // Será definido no setupUi
                bursting_charge: null, // Será definido no setupUi
                turret_traverse: null, // Será definido no setupUi
                reloading_method: null // Será definido no setupUi
            }
        }, 
        ...newState
    };
    
    document.getElementById('ship_name').value = APP.state.shipName;
    document.getElementById('country').value = APP.state.country;
    document.getElementById('naval_doctrine').value = APP.state.doctrine;
    document.getElementById('hull_type').value = APP.state.hull;
    
    document.getElementById('fuel_type').value = APP.state.fuel_type;
    document.getElementById('boiler_type').value = APP.state.boiler_type;
    document.getElementById('number_of_boilers').value = APP.state.number_of_boilers;
    document.getElementById('main_engine_type').value = APP.state.main_engine_type;
    document.getElementById('number_of_main_engines').value = APP.state.number_of_main_engines;
    document.getElementById('auxiliary_engine_type').value = APP.state.auxiliary_engine_type;
    document.getElementById('propeller_type').value = APP.state.propeller_type;
    document.getElementById('steering_mechanism_type').value = APP.state.steering_mechanism_type;

    document.getElementById('armor_type').value = APP.state.armor.type;
    document.getElementById('armor_thickness').value = APP.state.armor.thickness;
    
    document.getElementById('displacement_slider').value = APP.state.sliders.displacement;
    document.getElementById('speed_slider').value = APP.state.sliders.speed;
    document.getElementById('range_slider').value = APP.state.sliders.range;
    
    // Carregar os novos seletores de armamento
    // REMOVIDOS shell_ballistics_he_type e shell_ballistics_ap_type
    if (APP.state.components.shell_size) document.getElementById('shell_size_type').value = APP.state.components.shell_size;
    if (APP.state.components.propellant) document.getElementById('propellant_type').value = APP.state.components.propellant;
    if (APP.state.components.bursting_charge) document.getElementById('bursting_charge_type').value = APP.state.components.bursting_charge;
    if (APP.state.components.turret_traverse) document.getElementById('turret_traverse_type').value = APP.state.components.turret_traverse;
    if (APP.state.components.reloading_method) document.getElementById('reloading_method_type').value = APP.state.components.reloading_method;


    for (const categoryKey in APP.data.components) {
        for (const compKey in APP.data.components[categoryKey].options) {
             const select = document.getElementById(`comp_${compKey}`);
             if(select) {
                 select.value = APP.state.components[compKey] || Object.keys(APP.data.components[categoryKey].options[compKey].options)[0];
                 // Atualiza a descrição ao carregar o estado
                 const description = APP.data.components[categoryKey].options[compKey].options[select.value]?.description;
                 APP.updateDescription(`comp_${compKey}_description`, description);
             }
        }
    }

    const armamentList = document.getElementById('armament_list');
    armamentList.innerHTML = '';
    APP.state.armaments.forEach(arm => {
        let text = '';
        if (arm.type === 'gun_turret') {
            text = `${arm.turrets}x Torre(s) c/ ${arm.barrels} Canhão(s) de ${arm.caliber}mm (${APP.data.armaments.gun_marks[arm.mark].name})`;
            const shellSizeName = APP.data.armaments.shell_size[arm.shellSize]?.name || 'N/A';
            const propellantName = APP.data.armaments.propellant[arm.propellant]?.name || 'N/A';
            const burstingChargeName = APP.data.armaments.bursting_charge[arm.burstingCharge]?.name || 'N/A';
            const turretTraverseName = APP.data.armaments.turret_traverse[arm.turretTraverse]?.name || 'N/A';
            const reloadingMethodName = APP.data.armaments.reloading_method[arm.reloadingMethod]?.name || 'N/A';

            text += `<br>Tamanho Munição: ${shellSizeName}`;
            text += `<br>Propelente: ${propellantName}, Carga Explosiva: ${burstingChargeName}`;
            text += `<br>Virada Torre: ${turretTraverseName}, Recarga: ${reloadingMethodName}`;

        } else if (arm.type === 'torpedo_launcher') {
            text = `1x Lançador c/ ${arm.tubes} Torpedo(s) (${APP.data.armaments.torpedo_marks[arm.mark].name})`;
        } else if (arm.type === 'aa_gun') {
            text = `${arm.quantity}x ${APP.data.armaments.aa_guns[arm.aaType].name}`;
        }
        const div = document.createElement('div');
        div.className = 'item-row';
        div.innerHTML = `<span>${text}</span><button class="btn-danger" onclick="APP.removeArmament('${arm.id}')"><i class="fas fa-trash"></i></button>`;
        armamentList.appendChild(div);
    });
    
    const hullSelect = document.getElementById('hull_type');
    if (hullSelect) {
        const event = new Event('change');
        hullSelect.dispatchEvent(event);
    } else {
        APP.updateCalculations();
    }
    APP.updateInitialDescriptions(); // Garante que as descrições sejam carregadas na importação
};


document.addEventListener('DOMContentLoaded', APP.init);
