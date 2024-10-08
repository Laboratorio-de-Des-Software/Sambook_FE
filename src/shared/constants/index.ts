export interface IElements {
  title: string
  href?: string
  icon?: string
}

export const elements: IElements[] = [
  { title: 'Enredo', href: '/conteudo/enredo', icon: 'icon-enredo.svg' },
  { title: 'Fantasia', href: '/conteudo/fantasia', icon: 'icon-fantasia.svg' },
  { title: 'Alegoria', href: '/conteudo/alegoria', icon: 'icon-alegoria.svg' },
  {
    title: 'Samba Enredo',
    href: '/conteudo/sambaenredo',
    icon: 'icon-sambaEnredo.svg'
  },
  { title: 'Bateria', href: '/conteudo/bateria', icon: 'icon-bateria.svg' },
  { title: 'Harmonia', href: '/conteudo/harmonia', icon: 'icon-harmonia.svg' },
  { title: 'Evolução', href: '/conteudo/evolucao', icon: 'icon-evolucao.svg' },
  {
    title: 'Com. de Frente',
    href: '/conteudo/comissaodefrente',
    icon: 'icon-comFrente.svg'
  },
  {
    title: 'M. Sala & P. Bandeira',
    href: '/conteudo/mestresala&portabandeira',
    icon: 'icon-portaBandeira.svg'
  },
  {
    title: 'Info. Comp',
    href: '/conteudo/infocomplementar',
    icon: 'icon-infoComplementares.svg'
  }
]
