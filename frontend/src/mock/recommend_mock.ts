export interface recommendResult {
  image: string
  title: string
  link: string
  price: string
}
export interface recommendResponse {
  status: string
  prompt: string
  image_url: string
  results: recommendResult[]
}

export const mockRecommendData = {
  status: 'success',
  prompt: 'chair',
  image_url: 'https://files.catbox.moe/65ji7q.png',
  results: [
    {
      image:
        'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRZRZjD1ot2EI9Q254DAOVSzRfHYLYt96znvzdrEmA8lylxMtWmsXf-8vLU9c_NMAdcjGmEvy3YztXXdhHpVKoyOm7QNtwVR58CT2g-v2_FUgcu7QTegRxp',
      title: 'GTPLAYER Gaming Chair',
      link: 'https://www.google.com/shopping/product/11059419828952074894?gl=us',
      price: '$139.99'
    },
    {
      image:
        'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSMjtIpabUG6B-lPYXfKWmKNKo-LGGCswQvFfmJXoJLsvEjL0rIk8glkH74mdb3qtGeY8Zj1gXF7XFUzjJ9m4JjWFKKxkC0W1gPUJ1e_Jk',
      title: 'Drew Barrymore Beautiful Drew Accent Chair',
      link: 'https://www.google.com/shopping/product/4344811415995521423?gl=us',
      price: '$298.00'
    },
    {
      image:
        'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSmffg2BuCP6AusFXJaMwGeycmev46-_v_JoarLHf4tekc37XSsY9l2tr_V7nVGuAb9UuhaptFyzq2DdPxLxBMHGgQqY2tKuSUy4Zc2bSE',
      title: 'West Elm Hugo Chair Performance',
      link: 'https://www.google.com/shopping/product/6913744449933026891?gl=us',
      price: '$599.00'
    },
    {
      image:
        'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRzo_TPlhcJqYfdRD88xz4ADdnFGcoL8ZVy-KfYSK_57h2v0kzAdgUUOJvfO2DZtm9xEbupjJf9cpV4KL29CCYVoXWvMNPc1wbwz66Rnq_ejQwWVUydWJl7BA',
      title: 'BestOffice Contemporary Ergonomic Mesh Executive Chair',
      link: 'https://www.google.com/shopping/product/404287161531403043?gl=us',
      price: '$38.97'
    },
    {
      image:
        'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSwdhfpQWOB4Tf2s5BQy5XWpXkIBS3OLUi-RlZ6cFfcwIPwAebzpLc5NoonbM6ces5-JwHTCCJnKtJwSP5JdmN4fqqSE5j3rib5AgCDJUx53QaEU441fOd4',
      title: 'Ashley Drakelle Accent Chair',
      link: 'https://www.google.com/shopping/product/5428426454904411794?gl=us',
      price: '$268.12'
    }
  ]
}
