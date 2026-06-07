const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const hash = await bcrypt.hash('admin123', 10)

  await prisma.usuario.upsert({
    where: { email: 'admin@odontosoft.com' },
    update: {},
    create: {
      nombre: 'Administrador',
      email: 'admin@odontosoft.com',
      password: hash,
      rol: 'ADMIN'
    }
  })

  console.log('✅ Usuario admin creado')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())