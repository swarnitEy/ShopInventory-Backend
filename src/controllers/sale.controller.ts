import { Request, Response } from 'express';
import { SaleService, InsertSaleDto, UpdateSaleDto } from '../services/sale.service';
import { extractShopId } from '../utils/extractDetailsFromReq';

export const SaleController = {
  // Get all sales
  /**
   * Get all sales with pagination
   * @param req Express request object
   * @param res Express response object
   */
  async getSales(req: Request, res: Response): Promise<void> {
    try {
      const shopId = extractShopId(req, res);
      if (!shopId) return;

      const { page, limit } = req.query;

      const result = await SaleService.getAllSales({
        page: page as string,
        limit: limit as string
      }, shopId);

      res.status(200).json({
        success: true,
        message: 'Sales retrieved successfully',
        data: result.sales,
        metadata: {
          total: result.total,
          pages: result.pages,
          currentPage: page ? Number(page) : 1,
          limit: limit ? Number(limit) : 10
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve sales',
      });
    }
  },

  /**
   * Get a sale by ID
   * @param req Express request object
   * @param res Express response object
   */
  async getSaleById(req: Request, res: Response): Promise<void> {
    try {

      const shopId = extractShopId(req, res);
      if (!shopId) return;

      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Sale ID is required'
        });
        return;
      }

      const sale = await SaleService.getSaleById(id, shopId);

      res.status(200).json({
        success: true,
        message: 'Sale retrieved successfully',
        data: sale
      });
    } catch (error) {
      const status = error instanceof Error && error.message.includes('not found') ? 404 : 400;

      res.status(status).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve sale',
      });
    }
  },

  async createSale(req: Request, res: Response): Promise<void> {
    try {
      const shopId = extractShopId(req, res);
      if (!shopId) return; // Stop execution if shopId is missing


      const saleData: InsertSaleDto = req.body;

      // Parse date string to Date object if provided
      if (saleData.saleDate && typeof saleData.saleDate === 'string') {
        saleData.saleDate = new Date(saleData.saleDate);
      }

      const sale = await SaleService.createSale(saleData, shopId);

      res.status(201).json({
        success: true,
        message: 'Sale created successfully',
        data: sale
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create sale',
      });
    }
  },

  /**
  * Update a sale by ID
  * @param req Express request object
  * @param res Express response object
  */
  async updateSale(req: Request, res: Response): Promise<void> {
    try {

      const shopId = extractShopId(req, res);
      if (!shopId) return;

      const { id } = req.params;
      const updateData: UpdateSaleDto = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Sale ID is required'
        });
        return;
      }

      const updatedSale = await SaleService.updateSale(id, updateData, shopId);

      res.status(200).json({
        success: true,
        message: 'Sale updated successfully',
        data: updatedSale
      });
    } catch (error) {
      const status = error instanceof Error && error.message.includes('not found') ? 404 : 400;

      res.status(status).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update sale',
      });
    }
  },

  // Soft delete a sale by ID
  deleteSale: async (req: Request, res: Response) => {
    try {
      const shopId = extractShopId(req, res);
      if (!shopId) return;

      const saleId = req.params.id;
      if (!saleId) {
        res.status(400).json({ message: 'Sale ID is required' });
        return;
      }
      const sale = await SaleService.getSaleById(saleId, shopId);
      await SaleService.deleteSale(sale, shopId);
      res.status(200).json({ message: 'Sale deleted successfully' });
    } catch (error) {
      res.status(404).json({ message: "Error deleting sale", error });
    }
  },

  searchSales: async (req: Request , res: Response ) =>{
    const shopId = extractShopId(req, res);
      if (!shopId) return; // Stop execution if shopId is missing

const {buyerName, townName, productName,invoiceNumber,startDate,endDate} = req.query;
  const sales = await SaleService.searchSales(req.query, shopId);
res.status(200).json(sales);

},
  

};
