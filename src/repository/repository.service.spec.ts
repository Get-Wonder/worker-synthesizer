import { RepositoryService } from './repository.service'

describe('RepositoryService', () => {
  let service: RepositoryService

  beforeEach(async () => {

    service = module.get<RepositoryService>(RepositoryService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
