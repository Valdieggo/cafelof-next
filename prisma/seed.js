const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    await prisma.country.createMany({
        data: [
            {country_name: "Argentina"},
            {country_name: "Bolivia"},
            {country_name: "Brazil"},
            {country_name: "Chile"},
            {country_name: "Colombia"},
            {country_name: "Ecuador"},
            {country_name: "Paraguay"},
            {country_name: "Peru"},
            {country_name: "Uruguay"},
            {country_name: "Venezuela"}
          ]
    })

    const chile = await prisma.country.findUnique({
        where: {country_name: "Chile"}
    })

    await prisma.region.createMany({
        data: [
            {region_name: "Arica y Parinacota", country_id: chile.country_id},
            {region_name: "Tarapacá", country_id: chile.country_id},
            {region_name: "Antofagasta", country_id: chile.country_id},
            {region_name: "Atacama", country_id: chile.country_id},
            {region_name: "Coquimbo", country_id: chile.country_id},
            {region_name: "Valparaíso", country_id: chile.country_id},
            {region_name: "Metropolitana de Santiago", country_id: chile.country_id},
            {region_name: "Libertador General Bernardo O'Higgins", country_id: chile.country_id},
            {region_name: "Maule", country_id: chile.country_id},
            {region_name: "Ñuble", country_id: chile.country_id},
            {region_name: "Biobío", country_id: chile.country_id},
            {region_name: "La Araucanía", country_id: chile.country_id},
            {region_name: "Los Ríos", country_id: chile.country_id},
            {region_name: "Los Lagos", country_id: chile.country_id},
            {region_name: "Aysén del General Carlos Ibáñez del Campo", country_id: chile.country_id},
            {region_name: "Magallanes y de la Antártica Chilena", country_id: chile.country_id}
        ]
    })
    
    const chileRegionsAndCommunes = {
        "Arica y Parinacota": ["Arica", "Camarones", "General Lagos", "Putre"].sort(),
        "Tarapacá": ["Alto Hospicio", "Camiña", "Colchane", "Huara", "Iquique", "Pica", "Pozo Almonte"].sort(),
        "Antofagasta": ["Antofagasta", "Calama", "María Elena", "Mejillones", "Ollagüe", "San Pedro de Atacama", "Sierra Gorda", "Taltal", "Tocopilla"].sort(),
        "Atacama": ["Caldera", "Chañaral", "Copiapó", "Diego de Almagro", "Freirina", "Huasco", "Tierra Amarilla", "Vallenar"].sort(),
        "Coquimbo": ["Andacollo", "Canela", "Combarbalá", "Coquimbo", "Illapel", "La Higuera", "La Serena", "Los Vilos", "Monte Patria", "Ovalle", "Paiguano", "Punitaqui", "Río Hurtado", "Salamanca", "Vicuña"].sort(),
        "Valparaíso": ["Algarrobo", "Cabildo", "Calle Larga", "Cartagena", "Casablanca", "Catemu", "Concón", "El Quisco", "El Tabo", "Hijuelas", "Isla de Pascua", "Juan Fernández", "La Calera", "La Cruz", "La Ligua", "Limache", "Llaillay", "Los Andes", "Nogales", "Olmué", "Panquehue", "Papudo", "Petorca", "Puchuncaví", "Putaendo", "Quillota", "Quilpué", "Quintero", "Rinconada", "San Antonio", "San Esteban", "San Felipe", "Santa María", "Santo Domingo", "Valparaíso", "Villa Alemana", "Viña del Mar", "Zapallar"].sort(),
        "Metropolitana de Santiago": ["Alhué", "Buin", "Calera de Tango", "Cerrillos", "Cerro Navia", "Colina", "Conchalí", "Curacaví", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "Isla de Maipo", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Lampa", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "María Pinto", "Melipilla", "Ñuñoa", "Padre Hurtado", "Paine", "Pedro Aguirre Cerda", "Peñaflor", "Peñalolén", "Pirque", "Providencia", "Pudahuel", "Puente Alto", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Bernardo", "San Joaquín", "San José de Maipo", "San Miguel", "San Pedro", "San Ramón", "Santiago", "Talagante", "Tiltil", "Vitacura"].sort(),
        "Libertador General Bernardo O'Higgins": ["Chépica", "Chimbarongo", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "La Estrella", "Las Cabras", "Litueche", "Lolol", "Machalí", "Malloa", "Marchigüe", "Mostazal", "Nancagua", "Navidad", "Olivar", "Palmilla", "Paredones", "Peralillo", "Peumo", "Pichidegua", "Pichilemu", "Placilla", "Pumanque", "Quinta de Tilcoco", "Rancagua", "Rengo", "Requínoa", "San Fernando", "San Vicente", "Santa Cruz"].sort(),
        "Maule": ["Cauquenes", "Chanco", "Colbún", "Constitución", "Curepto", "Curicó", "Empedrado", "Hualañé", "Licantén", "Linares", "Longaví", "Maule", "Molina", "Parral", "Pelarco", "Pelluhue", "Pencahue", "Rauco", "Retiro", "Río Claro", "Romeral", "Sagrada Familia", "San Clemente", "San Javier", "San Rafael", "Talca", "Teno", "Vichuquén", "Villa Alegre", "Yerbas Buenas"].sort(),
        "Ñuble": ["Bulnes", "Chillán", "Chillán Viejo", "Cobquecura", "Coelemu", "Coihueco", "El Carmen", "Ninhue", "Ñiquén", "Pemuco", "Pinto", "Portezuelo", "Quillón", "Quirihue", "Ránquil", "San Carlos", "San Fabián", "San Ignacio", "San Nicolás", "Treguaco", "Yungay"].sort(),
        "Biobío": ["Alto Biobío", "Antuco", "Arauco", "Cabrero", "Cañete", "Chiguayante", "Concepción", "Contulmo", "Coronel", "Curanilahue", "Florida", "Hualpén", "Hualqui", "Laja", "Lebu", "Los Álamos", "Los Ángeles", "Lota", "Mulchén", "Nacimiento", "Negrete", "Penco", "Quilaco", "Quilleco", "San Pedro de la Paz", "San Rosendo", "Santa Bárbara", "Santa Juana", "Talcahuano", "Tirúa", "Tomé", "Tucapel", "Yumbel"].sort(),
        "La Araucanía": ["Angol", "Carahue", "Collipulli", "Cunco", "Curacautín", "Curarrehue", "Ercilla", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Lonquimay", "Los Sauces", "Lumaco", "Melipeuco", "Nueva Imperial", "Padre Las Casas", "Perquenco", "Pitrufquén", "Pucon", "Purén", "Renaico", "Saavedra", "Temuco", "Teodoro Schmidt", "Toltén", "Traiguén", "Victoria", "Vilcún", "Villarrica"].sort(),
        "Los Ríos": ["Corral", "Futrono", "La Unión", "Lago Ranco", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "Río Bueno", "Valdivia"].sort(),
        "Los Lagos": ["Ancud", "Calbuco", "Castro", "Chaitén", "Chonchi", "Cochamó", "Curaco de Vélez", "Dalcahue", "Fresia", "Frutillar", "Futaleufú", "Hualaihué", "Llanquihue", "Los Muermos", "Maullín", "Osorno", "Palena", "Puerto Montt", "Puerto Octay", "Puerto Varas", "Puyehue", "Queilén", "Quellón", "Quemchi", "Quinchao", "Río Negro", "San Juan de la Costa", "San Pablo"].sort(),
        "Aysén del General Carlos Ibáñez del Campo": ["Aysén", "Cisnes", "Cochrane", "Coyhaique", "Guaitecas", "Lago Verde", "O'Higgins", "Río Ibáñez", "Tortel"].sort(),
        "Magallanes y de la Antártica Chilena": ["Antártica", "Cabo de Hornos", "Laguna Blanca", "Natales", "Porvenir", "Primavera", "Punta Arenas", "Río Verde", "San Gregorio", "Timaukel", "Torres del Paine"].sort()
    }; 
    
    const chileRegions = await prisma.region.findMany({
        where: {
            country_id: chile.country_id
        },
        select: {
            region_name: true,
            region_id: true,
        }
    })
    
    const citiesData = [];

    chileRegions.forEach(region => {
        const cities = chileRegionsAndCommunes[region.region_name];
        if (cities) {
            cities.forEach(city => {
                citiesData.push({
                    city_name: city,
                    region_id: region.region_id
                });
            });
        }
    });

    await prisma.city.createMany({
        data: citiesData
    })

    // Creation of product categories
    const categories = [
        {product_category_name: "Café de grano"},
        {product_category_name: "Café molido"},
        {product_category_name: "Café instantáneo"},
        {product_category_name: "Accesorios"}
    ]

    await prisma.productCategory.createMany({
        data: categories
    })

    const moliendaAttribute = await prisma.attribute.upsert({
      where: { attribute_name: "Molienda" },
      update: {},
      create: {
        attribute_name: "Molienda",
      },
    });

    const moliendaValues = ["GRUESA", "MEDIA", "ESPRESSO", "SIN MOLER"];

    for (const value of moliendaValues) {
      await prisma.attributeEnum.upsert({
        where: {
          attribute_id_value: {
            attribute_id: moliendaAttribute.attribute_id,
            value,
          },
        },
        update: {},
        create: {
          attribute_id: moliendaAttribute.attribute_id,
          value,
        },
      });
    }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })