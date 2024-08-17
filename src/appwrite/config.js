import conf from "../conf/conf";
import {Client,ID, Databases, Storage, Query} from 'appwrite'

export class Service{
  client = new Client();
  databases;
  bucket;

  constructor(){
     this.client
    .setEndpoint(conf.appwriteUrl)
    .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);

  }

  async createPost({title, slug, content, userId, featuredImage, status}){
   try {
     return await this.databases.createDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      slug,
      {
        title, 
        content,
        userId,
        featuredImage,
        status
      }

     )
   } catch (error) {
      console.log('Appwrite createpost error', error);
   }
  }

  async updatePost(slug,{title,content, featuredImage, status}){
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          status,
          featuredImage
        }
      )
      
    } catch (error) {
      console.log('Appwrite updatepost error', error)
    }
  }

  async deletePost(slug){
    try {
       await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
      )
      return true;
    } catch (error) {
       console.log('Appwrite deletpost error', error)
       return false;
    }
  }

  async getPost(slug){
     try {
      
       return this.databases.getDocument(
             conf.appwriteDatabaseId,
             conf.appwriteCollectionId,
             slug,
       )
     } catch (error) {
       console.log('Appwrite getpost error', error)
       return false;
     }
  }

  async getPosts(queries = [Query.equal('status', 'active')]){
     try {
      return await this.databases.listDocuments(
         conf.appwriteDatabaseId,
         conf.appwriteCollectionId,
         queries,
      )
     } catch (error) {
       console.log('Appwrite getposts error', error);
       return false;
     }
  }


  // file upload method

  async uploadFile(file){
    try {
      return await this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file,
      )
    } catch (error) {
       console.log('Appwrite upload file error', error)
       return false;
    }
  }

  async deleteFile(fileId){
     try {
       await this.bucket.deleteFile(
        conf.appwriteBucketId,
        fileId,
       )
     } catch (error) {
       console.log('Appwrite deletefile error', error);
       return false;
     }
  }

  getFilePreview(fileId){
     return this.bucket.getFilePreview(
      conf.appwriteBucketId,
      fileId,
     )
  }
}


const service = new Service()

export default service;
