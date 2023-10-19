const { createBot, createProvider, createFlow, addKeyword, EVENTS, addAnswer } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
//const { createBotDialog } = require('@bot-whatsapp/contexts/dialogflow')

//'hola', 'ole', 'alo', 'buenos dias', 
//'buenas tardes', 'hola buenos dias', 'hola buenas tardes',
//'buenos dias me gustaria programar una cita', 'buenas tardes me gustaria programar una cita',
//'hola buenos dias me gustaria programar una cita', 'hola buenas tardes me gustaria programar una cita',
//'hola muy buenos dias me gustaria programar una cita', 'hola muy buenas tardes me gustaria programar una cita',
//'holi', 'oli', 'hola aleja', 'hola alejita', 'hola aleja para una cita', 'para una cita',
//'buenos dias tienes citas para hoy?', 'buenas tardes tienes citas para hoy?', 'hola tines citas para hoy?',
//'buenos dias que precio tiene el esmaltado tradicional', 'buenas tardes que precio tiene el esmaltado tradicional',
//'hola que precio tiene el esmaltado tradicional', 'buenos dias que precio tiene el esmaltado semipermanente',
//'buenas tardes que precio tiene el esmaltado semipermanente', 'hola que precio tiene el esmaltado semipermanente',
//'hola que precio tienen las acrilicas'

// ********************** DECLARANDO FUJOS HIJOS DE LOS FLUJOS HIJOS **************** //

// *********************** AGENDAR CITA DESDE INFO ****************************//
    
const AccionNoAgen = addKeyword('2', {sensitive:true})
    .addAnswer('Es una lastima que no agendes con nosotros😔.\nPero aqui estaremos para ayudarte en una proxima ocación.')
    

// **** FLUJOS HIJOS HIJOS PARA LA PROMO DEL MES ****//
const AccionSi = addKeyword('1', {sensitive:true})
    .addAnswer(
        [
            'Tomaste una gran decisión😃. ¿Cual servicio deseas hacerte?\n',
            'Por favor escribe si deseas hacerte *Manos✋*, *Pies👣* o *Combo✋👣* seguido de la fecha📆 y hora🕐 que lo deseas',
        ]
    )

const AccionNo = addKeyword('2', {sensitive:true})
    .addAnswer(
        [
            'Lamentamos que no tomes esta increible promoción, quizas en otro momento.',
        ]
    )

//********************************************


//** FLUJOS HIJOS HIJOS PARA CANCELAR O REAGENDAR CITA **/
const AccionReagendar = addKeyword('1', {sensitive:true})
.addAnswer(
    [
        'Muchas gracias por avisarnos 🙏. Y volver a contar con nosotros.\n',
        'Por favor escribe el servicio que te vas a realizar, *fecha📆* y *hora🕐* en que *estabas* agendad@.\n',
        'Despues escribe el nuevo servicio *(si lo vas a cambiar)* junto con la nueva *fecha📆* y *hora🕐* en que deseas ser reagendad@.\n'
    ]
)


const AccionCancelar = addKeyword('2', {sensitive:true})
    .addAnswer(
        [
            'Muchas gracias por avisarnos 🙏. Es muy importante ya que podremos agendar otras citas.\n',
            'Por favor escribe el servicio que te *ibas* a realizar, fecha📆 y hora🕐 en que estabas agendad@.\n',
        ]
    )
//**************************************************

//**************************************************************************************



// ***************************** DECLARANDO FLUJOS HIJOS ****************************** //

// ***** FLUJO AGENDAR CITA (1)**** //
const AgendarCita = addKeyword('1', {sensitive:true})
    .addAnswer(
        [
            'Wow🙌, estoy muy feliz😃! gracias por confiar en nosotros 🙏. Te dejaré una lista de los servicios que manejamos 👇',
        ]
        )
    .addAnswer('menu:', {
        media: 'C:/Users/Sebastian/Downloads/Carta de Servicios De Gold Nails Spa.pdf'
        },
        )
    .addAnswer('¿Ya Sabes qué hacerte?🤔.\nPor favor escribe el *nombre del servicio o servicios* que deseas realizarte💅.\n*(Solo debes enviar un mensaje).*\nEj: Manos semi y pies tradicionales para dos personas',
        {capture:true}, async(ctx, {state}) => {
            await state.update({nombre: ctx.body})}
        )
    .addAnswer('Ahora escribe la posible *Fecha 📆* y *hora 🕐* de tu servicio.\n*(Solo debes escribir un mensaje).*\n Ej: Mañana a las 3pm',
        {capture:true}, async(ctx, {state}) => {
            await state.update({fechaYhora: ctx.body})}
        )
    .addAnswer('Este es el resumen de tu pedido 👇',
        null, async (_, {flowDynamic, state}) => {
            const myState = state.getMyState();
            flowDynamic(`*Servicio:* ${myState.nombre}.\n*Fecha y hora:* ${myState.fechaYhora}.`)
            }    
        )
    .addAnswer('Gracias por contar con nosotros 😄. Estamos revisando nuestra agenda y pronto nos contacteremos contigo para confirmar la cita📱.')

//********************************


// *** FLUJO INFO DE LOS SERVICIOS (2)***//
const InfoServicios = addKeyword('2', {sensitive:true})
    .addAnswer(
        [
            'Mira nuestra carta de servicios📄.'
        ]
    )
    .addAnswer('Carta De Servicios Gold Nails Spa', {
        media: 'C:/Users/Sebastian/Downloads/Carta de Servicios De Gold Nails Spa.pdf'
    }
    )
    .addAnswer(
        [
            '¿Deseas hacerte algún servicio?🤔.\nEscribe el *número* que corresponda.\n',
            '*1* - Si.\n',
            '*2* - No.\n',
            '*0* - *🔙Menú Principal*.\n',
        ],
        {capture:true, delay:500}, (ctx, {flowDynamic, fallBack, gotoFlow})  => 
        {
            if (ctx.body != '1' && ctx.body != '2' && ctx.body != '0')
                {
                    flowDynamic('*❌Por favor ingresa una opción valida❌*')
                    return fallBack()
                }
            else if (ctx.body == '0') gotoFlow(flowPrincipal);
        }
        
        , [AgendarCita,AccionNoAgen]
        )

//***************************************


// ****** FLUJO PROMOCION DEL MES (3)**** //
const PromoMes = addKeyword('3', {sensitive:true})
    .addAnswer(
        [
            'Por este mes de *OCTUBRE*🎃👻 nuestra promo será la siguiente:\n',
            'Si agendas con anticipacion el servicio de manos o pies tradicionales tendras un bono de *3mil* pesos😱😱\n',
            'Y si agendas el combo de manos y pies tradicionales tendras un bono de *7mil* pesos😱😱\n',
            '¿Qué deseas?🤔.\nEscribe el *número* que corresponda.\n',
            '*1* - Aceptar la Promo.\n',
            '*2* - Ignorar la Promo.\n',
            '*0* - *🔙Menú Principal*.\n',
        ],
        {capture:true}, (ctx, {flowDynamic, fallBack, gotoFlow})  => {
            if (ctx.body != '1' && ctx.body != '2' && ctx.body != '0')
                {
                    flowDynamic('*❌Por favor ingresa una opción valida❌*')
                    return fallBack()
                }
            else if (ctx.body == '0') gotoFlow(flowPrincipal);
            }
        
        , [AccionSi,AccionNo]
    )
//**************************************


// ******** FLUJO CANCELAR O REAGENDAR CITA (4)***//
const CancelarCita_Reagendar = addKeyword('4', {sensitive:true})
    .addAnswer(
        [
            'Dejame saber si deseas cancelar la cita o reagendarla. *Escribe el numero que corresponde:*\n',
            '*1* - Reagendar mi cita.\n',
            '*2* - Cancelar mi cita.\n',
            '*0* - *🔙Menú Principal*.\n',

        ],
        {capture:true, delay:500}, (ctx, {flowDynamic, fallBack, gotoFlow})  => {
            if (ctx.body != '1' && ctx.body != '2' && ctx.body != '0')
                {
                    flowDynamic('*❌Por favor ingresa una opción valida❌*')
                    return fallBack()
                }
            else if (ctx.body == '0') gotoFlow(flowPrincipal);
            }
        ,[AccionReagendar,AccionCancelar]
    )
//**********************************************


// ******** FLUJO SERVICIO AL CLIENTE (5)***** //
const ServicioCliente = addKeyword('5', {sensitive:true})
    .addAnswer(
        [
            'Muchas gracias por comunicarte con servicio al cliente, mi nombre es *Alejandra*, ¿En qué te puedo ayudar?',
        ]
    )
//*********************************************




// ******************************** FLUJO PRINCIPAL ************************************* //

const flowPrincipal = addKeyword(['hola','ola','ole','oli','buenas tardes','buenas','buenos dias','buenas quiero una cita',
    'para agendar una cita', 'cita','por favor una cita','tienes cupo', 'una cita', 'para un cupo'])
    .addAnswer(
        [
            '🙌 Hola bienvenid@, mi nombre es *Uñitas* la *Inteligencia Artificial*🤖 de *Gold Nails Spa*💅 y fui creada para ayudarte',
        ]
        )    
    .addAnswer(
        [
            'Si te interesa alguna de estas opciones por favor *escribe el numero* que corresponde:\n',
            '*1* - Para Agendar una cita con nosotros.\n',
            '*2* - Para recibir información sobre nuestro servicios y precios.\n',
            '*3* - Para ver la *PROMO* del mes.\n',
            '*4* - Para Cancelar o Reagendar una cita.\n',
            '*5* - Para comunicarte con servicio al cliente.\n',
        ],
        {capture:true, delay:500}, (ctx, {flowDynamic, fallBack})  => 
        {
            if (ctx.body != '1' && ctx.body != '2' && ctx.body != '3' && ctx.body != '4' && ctx.body != '5')
                {
                    flowDynamic('*❌Por favor ingresa una opción valida❌*')
                    return fallBack()
                }
        }
        , [AgendarCita,InfoServicios,PromoMes,CancelarCita_Reagendar,ServicioCliente]
        )
//*************************************************************************************************

const fulojoSeg = addKeyword(['gracias', 'muchas gracias', 'mil gracias'])
    .addAnswer('Gracias a ti. Es un placer poder ayudarte🤗')


// ***************************************** MAIN *************************************************//
const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal, fulojoSeg])
    const adapterProvider = createProvider(BaileysProvider)


    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
