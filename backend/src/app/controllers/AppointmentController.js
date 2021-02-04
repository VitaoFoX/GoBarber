import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';
import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date', 'past', 'cancelable'],

      // Aqui serve para paginação, mostrar apenas 20 de cada vez
      // offset é a quantidade de "pulos"
      limit: 20,
      offset: (page - 1) * 20,

      // o Include é um "inner join", relaciona com outro model "tabela" sempre importar
      // attributes define quais campos irão para o json
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  async store(req, res) {
    // schame é validação de conteudo do req body
    const schema = Yup.object(0).shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { provider_id, date } = req.body;

    /**
     * Check if provider_id is a provider
     */

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }

    /**
     * Check if provider_id is a user
     */

    if (provider_id === req.userId) {
      return res
        .status(401)
        .json({ error: 'You cant create a appointments to provider  ' });
    }

    /**
     * Check for past dates
     */
    // Parseiso transforma a data em uma data usavel para JS.
    // Apos isso entra na função startofhour (Pega sempre o inicio da HORA).
    // Exemplo: 19:30 vira 19:00

    const hourStart = startOfHour(parseISO(date));

    // Verifica se o primeiro parametro é anterior ao segundo parametro
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permited' });
    }

    /**
     * Check date availability
     */
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return res.status(400).json({ error: 'Date are not availability' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart,
    });

    /**
     * Notify appointment provider
     */

    const user = await User.findByPk(req.userId);

    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    );

    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    if (appointment.user_id !== req.userId) {
      res.status(401).json({
        error: "You don't have permission to cancel this appointment",
      });
    }

    // removendo 2 horas do agendamento
    const dateWithSub = subHours(appointment.date, 2);
    // Verificar se a data do cancelamento é até 2 horas antes
    // 13:00 - o agendamento
    // 11:00 - dateWithSub - o horario max para cancelamento
    // 11:25h - agora (nao pode cancelar entao)
    // Se 11 for antes de 11:25, ja passo
    if (isBefore(dateWithSub, new Date())) {
      res.status(401).json({
        error: 'You cant only cancel appointments 2 hours in advance',
      });
    }
    // Atualizando o campo e cancelando
    appointment.canceled_at = new Date();
    await appointment.save();

    await Queue.add(CancellationMail.key, {
      appointment,
    });

    res.json(appointment);
  }
}
export default new AppointmentController();
